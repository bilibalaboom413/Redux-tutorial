import { useSelector } from 'react-redux'

import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'

import { selectPostById } from './postsSlice'

import { Spinner } from '../../components/Spinner'
import { useGetPostQuery } from '../api/apiSlice'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  // const post = useSelector((state) =>
  //   state.posts.find((post) => post.id === postId)
  // );
  // const post = useSelector((state) => selectPostById(state, postId))

  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)

  let content

  if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <article className="post">
        <h2>{post.title}</h2>
        <PostAuthor userId={post.user} /> <br />
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    )
  }

  // if (!post) {
  //   return (
  //     <section>
  //       <h2>Post not found</h2>
  //     </section>
  //   )
  // }

  return (
    <section>
      {/* <article className="post">
        <h2>{post.title}</h2>
        <PostAuthor userId={post.user} /> <br />
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article> */}
      {content}
    </section>
  )
}
