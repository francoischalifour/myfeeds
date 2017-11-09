require('dotenv').config()

const { REACT_APP_SERVER_HOST, REACT_APP_SERVER_PORT } = process.env
const ENDPOINT = `http://${REACT_APP_SERVER_HOST}:${REACT_APP_SERVER_PORT}`

const get = (resource, prefix = '', endpoint = ENDPOINT) =>
  fetch(`${endpoint}${prefix}${resource}`).then(res => res.json())
const getV1 = resource => get(resource, '/v1')

const isServerUp = async () => {
  try {
    await get('/status')
    return true
  } catch (err) {
    return false
  }
}

const getAllPosts = () => getV1('/posts')

const getPostById = id => getV1(`/posts/${id}`)

const getPostRepliesById = id => getV1(`/posts/${id}/replies`)

const getUserById = id => getV1(`/users/${id}`)

const getUserByUsername = username => getV1(`/users/@${username}`)

const getUserByEmail = email => getV1(`/users/email/${email}`)

const getAllPostsByUsername = username => getV1(`/users/@${username}/posts`)

const getAllPostsMatching = query => getV1(`/search/${query}`)

const getPublicProfileById = id => getV1(`/users/${id}/public`)

export default {
  isServerUp,
  getAllPosts,
  getPostById,
  getPostRepliesById,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  getAllPostsByUsername,
  getAllPostsMatching,
  getPublicProfileById,
}
