import allPosts from './posts.json'
import { getUserByUsername } from '../users'

export const getPosts = ({ username, matching }) => {
  const posts = username ? getUserPosts(username) : allPosts

  return matching
    ? posts.filter(post =>
        post.text.toLowerCase().includes(matching.toLowerCase())
      )
    : posts
}

export const getUserPosts = username =>
  allPosts.filter(post => post.user_id === getUserByUsername(username)._id)

export const getPostById = postId => allPosts.find(post => post._id === postId)
