import { destroyActiveUser } from 'utils'

const Logout = () => {
  destroyActiveUser()
  window.location.reload()

  return null
}

export default Logout
