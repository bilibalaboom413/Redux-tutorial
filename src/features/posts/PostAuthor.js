import { useSelector } from 'react-redux'
import { selectUserById } from '../users/usersSlice'

export const PostAuthor = ({ userId }) => {
  // const author = useSelector((state) =>
  //   state.users.find((user) => user.id === userId)
  // );

  // pass params need to be along with state
  const author = useSelector((state) => selectUserById(state, userId))

  return <span>by {author ? author.name : 'Unknown author'}</span>
}
