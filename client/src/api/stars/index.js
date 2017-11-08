import allStars from './stars.json'

export const getStarsByPostId = postId =>
  allStars.filter(star => star.post_id === postId)
