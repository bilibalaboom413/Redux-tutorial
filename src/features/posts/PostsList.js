import React, { useEffect } from 'react'
// No need for RTK
// import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

import classnames from 'classnames'

// No need for RTK
// import {
//   // selectAllPosts,
//   fetchPosts,
//   selectPostIds,
//   selectPostById,
// } from './postsSlice'

import { useGetPostsQuery } from '../api/apiSlice'
import { useMemo } from 'react'

// let PostExcerpt = ({ postId }) => {
// This way, <PostsList> only needs to re-render when that IDs array changes.
// const post = useSelector((state) => selectPostById(state, postId))
let PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}...</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

// ensure that the component inside of it only re-renders
// if the props have actually changed. Just a simple way
// PostExcerpt = React.memo(PostExcerpt)

export const PostsList = () => {
  // const dispatch = useDispatch()
  // const posts = useSelector(selectAllPosts)
  // const orderedPostIds = useSelector(selectPostIds)

  // const postStatus = useSelector((state) => state.posts.status)
  // const error = useSelector((state) => state.posts.error)

  // useEffect(() => {
  //   if (postStatus === 'idle') {
  //     dispatch(fetchPosts())
  //   }
  // }, [postStatus, dispatch])

  // Use RTK Query
  // Each generated query hook returns a "result" object containing several fields
  const {
    data: posts = [], // the actual response contents from the server. This field will be undefined until the response is received.
    isLoading, //  a boolean indicating if this hook is currently making the first request to the server
    isSuccess, // data should be defined now
    isFetching,
    isError,
    error, //  a serialized error object
    refetch,
  } = useGetPostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  let content

  // if (postStatus === 'loading') {
  //   content = <Spinner text="Loading..." />
  // } else if (postStatus === 'succeeded') {
  // Sort posts in reverse chronological order by datetime string
  // const orderedPosts = posts
  //   .slice()
  //   .sort((a, b) => b.date.localeCompare(a.date))

  // content = orderedPosts.map((post) => (
  //   <PostExcerpt key={post.id} post={post} />
  // ))
  //   content = orderedPostIds.map((postId) => (
  //     <PostExcerpt key={postId} postId={postId} />
  //   ))
  // } else if (postStatus === 'failed') {
  //   content = <div>{error}</div>
  // }

  // RTK Query
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderPosts = sortedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))

    const containerClassname = classnames('posts-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>{renderPosts}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
