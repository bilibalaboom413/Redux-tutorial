import React, { useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'

import { selectAllUsers } from '../users/usersSlice'
import {
  selectAllNotifications,
  allNotificationsRead,
} from './notificationsSlice'

import classnames from 'classnames'

export const NotificationsList = () => {
  const dispatch = useDispatch()

  const notifications = useSelector(selectAllNotifications)
  // console.log(notifications)
  const users = useSelector(selectAllUsers)
  // avoid flashing of old data as this component updates
  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    // notification: {id, date, message, user}
    const user = users.find((user) => user.id === notification.user) || {
      name: 'Unknown User',
    }

    // We also want to add an additional classname to any notification
    // list entries in the page, to highlight them:
    const notificationClassname = classnames('notification', {
      new: notification.isNew, // true / false
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
          <div title={notification.date}>
            <i>{timeAgo} ago</i>
          </div>
        </div>
      </div>
    )
  })

  return (
    <section className="noticationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
