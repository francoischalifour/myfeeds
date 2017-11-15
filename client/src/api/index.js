require('dotenv').config()

const {
  REACT_APP_SERVER_HOST,
  REACT_APP_SERVER_PORT,
  REACT_APP_MAINTENANCE,
} = process.env
const ENDPOINT = `${REACT_APP_SERVER_HOST}:${REACT_APP_SERVER_PORT}`

const get = (resource, prefix = '', endpoint = ENDPOINT) =>
  fetch(`${endpoint}${prefix}${resource}`).then(res => res.json())
const getV1 = resource => get(resource, '/v1')

const post = (resource, body, prefix = '', endpoint = ENDPOINT) =>
  fetch(`${endpoint}${prefix}${resource}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(res => res.json())
const postV1 = (resource, body) => post(resource, body, '/v1')

const isServerUp = async () => {
  if (REACT_APP_MAINTENANCE) {
    return false
  }

  try {
    await get('/status')
    return true
  } catch (err) {
    return false
  }
}

const getAllPostsAsUserId = ({ userId, startId, postId, limit }) => {
  if (postId) {
    return getPostRepliesByIdAsUserId({ userId, startId, postId, limit })
  } else {
    return startId
      ? getV1(`/posts/start/${startId}/limit/${limit}/as/${userId}`)
      : getV1(`/posts/limit/${limit}/as/${userId}`)
  }
}

const getPostByIdAsUserId = (postId, userId) =>
  getV1(`/posts/${postId}/as/${userId}`)

const getPostRepliesByIdAsUserId = ({ postId, userId, startId, limit }) =>
  startId
    ? getV1(
        `/posts/${postId}/replies/start/${startId}/limit/${limit}/as/${userId}`
      )
    : getV1(`/posts/${postId}/replies/start/null/limit/${limit}/as/${userId}`)

const getPostFavoritesById = id => getV1(`/posts/${id}/favorites`)

const getUserById = id => getV1(`/users/${id}`)

const getUserByUsername = username => getV1(`/users/@${username}`)

const getAllPostsByUsernameAsUserId = (username, userId) =>
  getV1(`/users/@${username}/posts/as/${userId}`)

const getAllPostsMatchingAsUserId = (query, userId) =>
  getV1(`/search/${query}/as/${userId}`)

const getAllPostsHashtagAsUserId = (query, userId) =>
  getV1(`/hashtags/${query}/as/${userId}`)

const getPublicProfileById = id => getV1(`/users/${id}/public`)

const login = (email, password) =>
  postV1('/login', {
    email,
    password,
  })

const addPost = post => postV1('/posts', post)

const favorite = fav => postV1('/favorites/create', fav)

const unfavorite = fav => postV1('/favorites/delete', fav)

export default {
  isServerUp,
  getAllPostsAsUserId,
  getPostByIdAsUserId,
  getPostRepliesByIdAsUserId,
  getPostFavoritesById,
  getUserById,
  getUserByUsername,
  getAllPostsByUsernameAsUserId,
  getAllPostsMatchingAsUserId,
  getAllPostsHashtagAsUserId,
  getPublicProfileById,
  login,
  addPost,
  favorite,
  unfavorite,
}
