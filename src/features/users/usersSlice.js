import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'

// const initialState = []
const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    // builder.addCase(fetchUsers.fulfilled, (state, action) => {
    //   return action.payload
    // })

    // The only action we're handling here always replaces the entire
    // list of users with the array we fetched from the server.
    // We can use usersAdapter.setAll to implement that instead.
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  },
})

// export const selectAllUsers = (state) => state.users

// export const selectUserById = (state, userId) =>
//   state.users.find((user) => user.id === userId)

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => state.users)

export default usersSlice.reducer
