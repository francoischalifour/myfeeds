require('dotenv').config()

const { REACT_APP_SERVER_HOST, REACT_APP_SERVER_PORT } = process.env
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
  try {
    await get('/status')
    return true
  } catch (err) {
    return false
  }
}

const getAllPosts = () => getV1('/posts')

const getAllPostsAsUserId = id => getV1(`/posts/as/${id}`)

const getPostById = id => getV1(`/posts/${id}`)

const getPostByIdAsUserId = (postId, userId) =>
  getV1(`/posts/${postId}/as/${userId}`)

const getPostRepliesById = id => getV1(`/posts/${id}/replies`)

const getPostRepliesByIdAsUserId = (postId, userId) =>
  getV1(`/posts/${postId}/replies/as/${userId}`)

const getUserById = id => getV1(`/users/${id}`)

const getUserByUsername = username => getV1(`/users/@${username}`)

const getAllPostsByUsername = username => getV1(`/users/@${username}/posts`)

const getAllPostsByUsernameAsUserId = (username, userId) =>
  getV1(`/users/@${username}/posts/as/${userId}`)

const getAllPostsMatching = query => getV1(`/search/${query}`)

const getAllPostsMatchingAsUserId = (query, userId) =>
  getV1(`/search/${query}/as/${userId}`)

const getAllPostsHashtag = query => getV1(`/hashtags/${query}`)

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
  getAllPosts,
  getAllPostsAsUserId,
  getPostById,
  getPostByIdAsUserId,
  getPostRepliesById,
  getPostRepliesByIdAsUserId,
  getUserById,
  getUserByUsername,
  getAllPostsByUsername,
  getAllPostsByUsernameAsUserId,
  getAllPostsMatching,
  getAllPostsMatchingAsUserId,
  getAllPostsHashtag,
  getAllPostsHashtagAsUserId,
  getPublicProfileById,
  login,
  addPost,
  favorite,
  unfavorite,
}
