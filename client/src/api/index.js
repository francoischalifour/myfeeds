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

const getUser = ({ userId, username, as }) =>
  username
    ? getV1(`/users/@${username}?as=${as}`)
    : getV1(`/users/${userId}?as=${as}`)

const getAllUserPosts = ({ username, userId }) =>
  getV1(`/users/@${username}/posts?as=${userId}`)

const getAllPostsMatching = ({ query, userId }) =>
  getV1(`/search/${query}?as=${userId}`)

const getAllPostsHashtag = ({ query, userId }) =>
  getV1(`/hashtags/${query}?as=${userId}`)

const getBestPosts = ({ userId, since = '', limit = 10, sort = 'desc' }) =>
  getV1(`/moments/best?as=${userId}&since=${since}&limit=${limit}&sort=${sort}`)

const getControversedPosts = ({
  userId,
  since = '',
  limit = 10,
  sort = 'desc',
}) =>
  getV1(
    `/moments/controversed?as=${userId}&since=${since}&limit=${limit}&sort=${
      sort
    }`
  )

const getPopularPosts = ({ userId, since = '', limit = 10, sort = 'desc' }) =>
  getV1(
    `/moments/popular?as=${userId}&since=${since}&limit=${limit}&sort=${sort}`
  )

const login = info => postV1('/login', info)

const signup = info => postV1('/signup', info)

const update = info => postV1('/update', info)

const addPost = post => postV1('/posts', post)

const favorite = fav => postV1('/favorites/create', fav)

const unfavorite = fav => postV1('/favorites/delete', fav)

const follow = follow => postV1('/followers/create', follow)

const unfollow = follow => postV1('/followers/delete', follow)

export default {
  isServerUp,
  getAllPosts,
  getPost,
  getPostFavorites,
  getUser,
  getAllUserPosts,
  getAllPostsMatching,
  getAllPostsHashtag,
  getBestPosts,
  getControversedPosts,
  getPopularPosts,
  login,
  signup,
  update,
  addPost,
  favorite,
  unfavorite,
  follow,
  unfollow,
}
