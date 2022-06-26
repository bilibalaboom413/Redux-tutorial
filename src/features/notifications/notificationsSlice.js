// import React from 'react'
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { client } from '../../api/client'

/**
 * retrieve a list of new notifications from the server
 */
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )

    return response.data
  }
)

const notificationAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const notificationsSlice = createSlice({
  name: 'notifications',
  // initialState: [],
  initialState: notificationAdapter.getInitialState(),
  reducers: {
    // Marks all notifications as read
    allNotificationsRead(state, action) {
      // state.forEach((notification) => {
      //   notification.read = true
      Object.values(state.entities).forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      /**
       * we will be getting back an array of notifications,
       * so we can pass them as separate arguments to state.push(),
       * and the array will add each item
       */
      // state.push(...action.payload)
      // Any notifications we've read are no longer new
      // state.forEach((notification) => (notification.isNew = !notification.read))
      // console.log(state)
      // state.sort((a, b) => b.date.localeCompare(a.date))

      notificationAdapter.upsertMany(state, action.payload)
      Object.values(state.entities).forEach((notification) => {
        notification.isNew = !notification.read
      })
    })
  },
})

export default notificationsSlice.reducer

// export const selectAllNotifications = (state) => state.notifications
export const { selectAll: selectAllNotifications } =
  notificationAdapter.getSelectors((state) => state.notifications)

export const { allNotificationsRead } = notificationsSlice.actions
