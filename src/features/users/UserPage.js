import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectPostsByUser } from '../posts/postsSlice'
import { selectUserById } from './usersSlice'

export const UserPage = ({ match }) => {
  // Destructure and get the userId parameter
  const { userId } = match.params

  const user = useSelector((state) => selectUserById(state, userId))
  // useSelector will re-run every time an action is dispatched
  const postsForUser = useSelector((state) => {
    // const allPosts = selectAllPosts(state)
    // return allPosts.filter((post) => post.user === userId)
    // no need to use selectAllPosts to improve performance
    selectPostsByUser(state, userId)
  })

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  )
}
