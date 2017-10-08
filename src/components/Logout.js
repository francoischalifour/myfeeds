import { deleteCurrentUserId } from '../utils'

const Logout = () => {
  deleteCurrentUserId()
  window.location.reload()

  return null
}

export default Logout
