import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'

const postsAdapter = createEntityAdapter({
  // keep an array of all post IDs sorted with the newest post first
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})
// generates an empty {ids: [], entities: {}}
const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
})

// const initialState = {
//   posts: [],
//   status: 'idle',
//   error: null,
// }

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await client.post('/fakeApi/posts', initialPost)
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      // const existingPost = state.posts.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.entities[id]
      // const existingPost = state.posts.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        // state.posts = state.posts.concat(action.payload)
        // Use the `upsertMany` reducer as a mutating update utility
        postsAdapter.upsertMany(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // .addCase(addNewPost.fulfilled, (state, action) => {
      //   state.posts.push(action.payload)
      // })
      // Use the `addOne` reducer for the fulfilled case
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  },
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// export const selectAllPosts = (state) => state.posts.posts

// export const selectPostById = (state, postId) =>
//   state.posts.posts.find((post) => post.id === postId)

/**
 * The generated selector functions are always called
 * selectAll and selectById, so we can use ES6 destructuring syntax
 * to rename them as we export them and match the old selector names.
 * We'll also export selectPostIds the same way,
 * since we want to read the list of sorted post IDs in our
 * <PostsList> component.
 */
// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors((state) => state.posts)

/**
 * createSelector takes one or more "input selector" functions as argument,
 * plus an "output selector" function.
 * When we call selectPostsByUser(state, userId), createSelector will pass
 * all of the arguments into each of our input selectors.
 * Whatever those input selectors return becomes the arguments for the output selector.
 */
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.user === userId)
)
