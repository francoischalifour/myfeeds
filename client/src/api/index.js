require('dotenv').config()

const { REACT_APP_SERVER_HOST, REACT_APP_SERVER_PORT } = process.env
const ENDPOINT = `http://${REACT_APP_SERVER_HOST}:${REACT_APP_SERVER_PORT}`

const get = resource => fetch(`${ENDPOINT}${resource}`).then(res => res.json())
const getV1 = resource =>
  fetch(`${ENDPOINT}/v1${resource}`).then(res => res.json())

const isServerUp = async () => {
  try {
    await get('/status')
    return true
  } catch (err) {
    return false
  }
}

const getAllPosts = async () => {
  const posts = await getV1('/posts')
  const postsWithAuthor = posts.map(async post => {
    const { username, name, profile_image_url } = await getUserById(
      post.user_id
    )

    return {
      ...post,
      username,
      name,
      profile_image_url,
    }
  })

  return Promise.all(postsWithAuthor)
}

const getPostById = async id => {
  const post = await getV1(`/posts/${id}`)
  const { username, name, profile_image_url } = await getUserById(post.user_id)

  return Promise.resolve({
    ...post,
    username,
    name,
    profile_image_url,
  })
}

const getPostRepliesById = async id => {
  const replies = await getV1(`/posts/${id}/replies`)
  const repliesWithAuthor = replies.map(async reply => {
    const { username, name, profile_image_url } = await getUserById(
      reply.user_id
    )

    return {
      ...reply,
      username,
      name,
      profile_image_url,
    }
  })

  return Promise.all(repliesWithAuthor)
}

const getUserById = id => getV1(`/users/${id}`)

const getUserByUsername = username => getV1(`/users/@${username}`)

const getUserByEmail = email => getV1(`/users/email/${email}`)

const getAllPostsByUsername = async username => {
  const posts = await getV1(`/users/@${username}/posts`)
  const postsWithAuthor = posts.map(async post => {
    const { username, name, profile_image_url } = await getUserById(
      post.user_id
    )

    return {
      ...post,
      username,
      name,
      profile_image_url,
    }
  })

  return Promise.all(postsWithAuthor)
}

const getAllPostsMatching = async query => {
  const posts = await getV1(`/search/${query}`)
  const postsWithAuthor = posts.map(async post => {
    const { username, name, profile_image_url } = await getUserById(
      post.user_id
    )

    return {
      ...post,
      username,
      name,
      profile_image_url,
    }
  })

  return Promise.all(postsWithAuthor)
}

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
