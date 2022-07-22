import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { selectAllUsers } from '../users/usersSlice'
// import { addNewPost } from './postsSlice'
import { useAddNewPostMutation } from '../api/apiSlice'
import { Spinner } from '../../components/Spinner'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  // const [addRequestStatus, setAddRequestStatus] = useState('idle')

  // const dispatch = useDispatch()
  // const users = useSelector((state) => state.users)

  // Mutation hooks return an array with two values:
  // trigger function: make request to the server
  // The second value is an object with metadata about the current in-progress request, if any.
  const [addNewPost, { isLoading }] = useAddNewPostMutation()
  const users = useSelector(selectAllUsers)

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)

  // const onSavePostClicked = () => {
  // if (title && content) {
  //   dispatch(
  //     postAdded({
  //       id: nanoid(),
  //       title,
  //       content
  //     })
  //   );
  // }

  // setTitle("");
  // setContent("");
  //   if (title && content) {
  //     dispatch(postAdded(title, content, userId));
  //     setTitle("");
  //     setContent("");
  //   }
  // };

  // const canSave =
  //   [title, content, userId].every(Boolean) && addRequestStatus === 'idle'
  const canSave = [title, content, userId].every(Boolean) && !isLoading

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        // setAddRequestStatus('pending')
        /**
         *  adds a .unwrap() function to the returned Promise,
         * which will return a new Promise that either has the actual action.payload value
         *  from a fulfilled action, or throws an error if it's the rejected action.
         */
        // await dispatch(addNewPost({ title, content, user: userId })).unwrap()
        await addNewPost({ title, content, user: userId }).unwrap()
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      }
      // finally {
      //   setAddRequestStatus('idle')
      // }
    }
  }

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  const spinner = isLoading ? <Spinner size="30px" /> : null

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="Make a title for your post"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          placeholder="Input something interesting"
          value={content}
          onChange={onContentChanged}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
            Save Post
          </button>
        </div>
      </form>
    </section>
  )
}
