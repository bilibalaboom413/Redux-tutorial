import {
  // createSlice,
  // createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { apiSlice } from '../api/apiSlice'

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (res) => {
        return usersAdapter.setAll(initialState, res)
      },
    }),
  }),
})

export const { useGetUsersQuery } = extendedApiSlice

export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
)

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState)

// import { client } from '../../api/client'
// export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
//   const response = await client.get('/fakeApi/users')
//   return response.data
// })
// const usersSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {},
//   extraReducers(builder) {
// builder.addCase(fetchUsers.fulfilled, (state, action) => {
//   return action.payload
// })

// The only action we're handling here always replaces the entire
// list of users with the array we fetched from the server.
// We can use usersAdapter.setAll to implement that instead.
//     builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
//   },
// })

// export const selectAllUsers = (state) => state.users

// export const selectUserById = (state, userId) =>
//   state.users.find((user) => user.id === userId)
// export default usersSlice.reducer
