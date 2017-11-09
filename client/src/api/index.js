require('dotenv').config()

const { REACT_APP_SERVER_HOST, REACT_APP_SERVER_PORT } = process.env
const ENDPOINT = `http://${REACT_APP_SERVER_HOST}:${REACT_APP_SERVER_PORT}`

const get = resource => fetch(`${ENDPOINT}${resource}`).then(res => res.json())

const getAllPosts = async () => {
  const posts = await get('/posts')
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
  const post = await get(`/posts/${id}`)
  const { username, name, profile_image_url } = await getUserById(post.user_id)

  return Promise.resolve({
    ...post,
    username,
    name,
    profile_image_url,
  })
}

const getPostRepliesById = async id => {
  const replies = await get(`/posts/${id}/replies`)
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

const getUserById = id => get(`/users/${id}`)

const getUserByUsername = username => get(`/users/@${username}`)

const getUserByEmail = email => get(`/users/email/${email}`)

const getAllPostsByUsername = async username => {
  const posts = await get(`/users/@${username}/posts`)
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
  const posts = await get(`/search/${query}`)
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

const getPublicProfileById = id => get(`/users/${id}/public`)

export default {
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
