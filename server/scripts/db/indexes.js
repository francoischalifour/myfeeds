const {
  COLLECTION_USERS,
  COLLECTION_POSTS,
  COLLECTION_FAVORITES,
  COLLECTION_FOLLOWERS,
} = require('../../constants')

const indexes = {
  [COLLECTION_USERS]: [
    {
      description: "get a user's profile",
      value: [{ username: 1 }, { unique: true }],
    },
    {
      description: "get a user's account (login and signup)",
      value: [{ email: 1 }, { unique: true }],
    },
  ],
  [COLLECTION_FOLLOWERS]: [
    {
      description: 'check if a user has followed another',
      value: [{ follower_id: 1, user_id: 1 }],
    },
  ],
  [COLLECTION_POSTS]: [
    {
      description: 'get ordered feeds',
      value: [{ created_at: 1 }],
    },
    {
      description: 'search for posts',
      value: [{ text: 'text' }],
    },
    {
      description: "get a post's user metadata",
      value: [{ user_id: 1, parent_id: 1 }],
    },
  ],
  [COLLECTION_FAVORITES]: [
    {
      description: "get a post's favs",
      value: [{ post_id: 1 }],
    },
    {
      description: 'get ordered favs',
      value: [{ created_at: 1 }],
    },
    {
      description: 'check if a user has favorited',
      value: [{ post_id: 1, user_id: 1 }],
    },
  ],
}

module.exports = indexes
