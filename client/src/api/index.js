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

const getAllPosts = ({
  userId,
  postId,
  since = '',
  limit = '',
  sort = 'desc',
}) =>
  postId
    ? getPostReplies({ userId, postId, since, limit, sort })
    : getV1(`/posts?as=${userId}&since=${since}&limit=${limit}&sort=${sort}`)

const getPost = ({ postId, userId }) => getV1(`/posts/${postId}?as=${userId}`)

const getPostReplies = ({ postId, userId, since, limit, sort }) =>
  getV1(
    `/posts/${postId}/replies?as=${userId}&since=${since}&limit=${limit}&sort=${
      sort
    }`
  )

const getPostFavorites = ({ postId }) => getV1(`/posts/${postId}/favorites`)

const getUser = ({ userId, username }) =>
  username ? getV1(`/users/@${username}`) : getV1(`/users/${userId}`)

const getAllUserPosts = ({ username, userId }) =>
  getV1(`/users/@${username}/posts?as=${userId}`)

const getAllPostsMatching = ({ query, userId }) =>
  getV1(`/search/${query}?as=${userId}`)

const getAllPostsHashtag = ({ query, userId }) =>
  getV1(`/hashtags/${query}?as=${userId}`)

const getPublicProfile = ({ userId }) => getV1(`/users/${userId}/public`)

const login = ({ email, password }) =>
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
  getPost,
  getPostFavorites,
  getUser,
  getAllUserPosts,
  getAllPostsMatching,
  getAllPostsHashtag,
  getPublicProfile,
  login,
  addPost,
  favorite,
  unfavorite,
}
