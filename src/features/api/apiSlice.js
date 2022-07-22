// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All requests start with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  // automatic data refetching
  tagTypes: ['Post'], // declaring an array of string tag names for data types such as 'Post'
  // The 'endpoints'represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    // builder.mutation() send an update to server
    getPosts: builder.query({
      // URL is '/fakeApi/posts
      // By default, query endpoints will use a GET HTTP request,
      // but you can override that by returning an object like
      // {url: '/posts', method: 'POST', body: newPost}
      // instead of just the URL string itself.
      query: () => '/posts',
      // providesTags: ['Posts'], // listing a set of tags describing the data in that query
      providesTags: (result = [], error, arg) => [
        'Post',
        ...result.map(({ id }) => ({
          type: 'Post',
          id,
        })),
      ],
    }),
    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg }],
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Posts'], //  listing a set of tags that are invalidated every time that mutation runs
    }),
    editPost: builder.mutation({
      query: (post) => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        body: { reaction },
      }),
      async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.find((post) => post.id === postId)
            if (post) {
              post.reactions[reaction]++
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

// Export the auto-generated hook for the 'getPosts' query endpoint
export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation,
} = apiSlice
