const { MongoClient } = require('mongodb')
const connect = require('../../../utils/connect')
const { COLLECTION_POSTS, COLLECTION_USERS } = require('../../../constants')

/**
 * Merges the given posts with their authors' information to send only one response to the client.
 * To improve the efficiency, it looks up in a user reference object if the author is already known
 * to not request the database when not needed.
 *
 * This function triggers side effects since it merges the results.
 *
 * @param {object[]} posts The posts to populate with the authors
 * @param {object} db The database object
 * @private
 */
const mergePostsWithAuthors = async (posts, db) => {
  const userLookup = {}

  for (let post of posts) {
    const authorId = post.user_id

    if (!userLookup[authorId]) {
      const author = await db
        .collection(COLLECTION_USERS)
        .findOne({ _id: authorId })

      userLookup[authorId] = getAuthorData(author)
    }

    Object.assign(post, userLookup[authorId])
  }
}

/**
 * Returns the author's public information to be merged with the post.
 *
 * @param {object} author The author to get the data from
 * @return {object}
 * @private
 */
const getAuthorData = author => ({
  username: author.username,
  name: author.name,
  profile_image_url: author.profile_image_url,
})

const Posts = {
  async getFeed() {
    const db = await connect()
    const result = await db
      .collection(COLLECTION_POSTS)
      .find({
        parent_id: { $exists: false },
      })
      .toArray()

    await mergePostsWithAuthors(result, db)

    await db.close()

    return result
  },
  async getById(id) {
    const db = await connect()
    const result = await db.collection(COLLECTION_POSTS).findOne({ _id: id })
    const author = await db
      .collection(COLLECTION_USERS)
      .findOne({ _id: result.user_id })

    Object.assign(result, getAuthorData(author))

    await db.close()

    return result
  },
  async getRepliesById(id) {
    const db = await connect()
    const result = await db
      .collection(COLLECTION_POSTS)
      .find({ parent_id: id })
      .toArray()

    await mergePostsWithAuthors(result, db)

    await db.close()

    return result
  },
  async getUserFeedByUsername(username) {
    const db = await connect()
    const user = await db
      .collection(COLLECTION_USERS)
      .findOne({ username }, { _id: 1 })
    let result

    if (!user) {
      result = []
    } else {
      result = await db
        .collection(COLLECTION_POSTS)
        .find({ user_id: user._id })
        .toArray()

      await mergePostsWithAuthors(result, db)
    }

    await db.close()

    return result
  },
  async searchQuery(query) {
    const db = await connect()
    const result = await db
      .collection(COLLECTION_POSTS)
      .find({ $text: { $search: query } })
      .toArray()

    await mergePostsWithAuthors(result, db)

    await db.close()

    return result
  },
}

module.exports = Posts
