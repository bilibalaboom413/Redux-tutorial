import React, { useState } from 'react'
// import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom'

// import { postUpdated, selectPostById } from "./postsSlice";
import { Spinner } from '../../components/Spinner'
import { useGetPostQuery, useEditPostMutation } from '../api/apiSlice'

export const EditPostForm = ({ match }) => {
  const { postId } = match.params
  // console.log("!!!");
  // console.log(postId);

  // const post = useSelector((state) =>
  //   state.posts.find((post) => post.id === postId)
  // );
  // const post = useSelector((state) => selectPostById(state, postId));
  const { data: post } = useGetPostQuery(postId)

  const [updatePost, { isLoading }] = useEditPostMutation()

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  // const dispatch = useDispatch();
  const history = useHistory()

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)

  const onSavePostClicked = async () => {
    if (title && content) {
      // dispatch(postUpdated({ id: postId, title, content }));
      await updatePost({ id: postId, title, content })
      // back to view post
      history.push(`/posts/${postId}`)
    }
  }

  const spinner = isLoading ? <Spinner text="Saving..." /> : null

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
          disabled={isLoading}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
          disabled={isLoading}
        />
      </form>
      <button type="button" onClick={onSavePostClicked} disabled={isLoading}>
        Save Post
      </button>
      {spinner}
    </section>
  )
}
