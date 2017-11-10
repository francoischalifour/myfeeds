const { ObjectID } = require('mongodb')
const connect = require('../../../utils/connect')
const { objectifyProps } = require('../../../utils')
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

/**
 * Returns posts with highlighted search results.
 *
 * This is a custom function because MongoDB cannot return matching elements.
 *
 * Uses a regex to ignore all non-alphanumerical characters.
 *  - `\w` is any digit, letter, or underscore.
 *  - `\s` is any whitespace.
 *  - `[^\w\s]` is anything that's not a digit, letter, whitespace, or underscore.
 *  - `[^\w\s]|_` is the same as #3 except with the underscores added back in.
 * See: https://stackoverflow.com/a/4328546
 *
 * @param {object[]} posts The posts to highlight terms in
 * @param {string} terms The terms to highlight
 * @param {string} tag The tag to wrap the terms with
 * @return {object[]}
 * @private
 */
const highlightTerms = (posts, terms, tag = 'em') => {
  const words = terms
    .replace(/[^\w\s]|_/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')

  return posts.map(post => {
    words.forEach(word => {
      const regex = new RegExp(word, 'gi')
      post.text = post.text.replace(regex, `<${tag}>${word}</${tag}>`)
    })
    return post
  })
}

const Posts = {
  async getFeed() {
    const db = await connect()
    const result = await db
      .collection(COLLECTION_POSTS)
      .find({
        parent_id: { $exists: false },
      })
      .sort({
        created_at: -1,
      })
      .toArray()
    await mergePostsWithAuthors(result, db)
    db.close()

    return result
  },
  async get(objectFilter) {
    const filter = objectifyProps(objectFilter)

    const db = await connect()
    const result = await db.collection(COLLECTION_POSTS).findOne(filter)
    const author = await db
      .collection(COLLECTION_USERS)
      .findOne({ _id: result.user_id })
    Object.assign(result, getAuthorData(author))
    db.close()

    return result
  },
  async getReplies(objectFilter) {
    const filter = objectifyProps(objectFilter)

    const db = await connect()
    const result = await db
      .collection(COLLECTION_POSTS)
      .find(filter)
      .sort({
        created_at: 1,
      })
      .toArray()
    await mergePostsWithAuthors(result, db)
    db.close()

    return result
  },
  async getUserFeed(objectFilter) {
    const filter = objectifyProps(objectFilter)

    const db = await connect()
    const user = await db
      .collection(COLLECTION_USERS)
      .findOne(filter, { _id: 1 })
    let result

    if (!user) {
      result = []
    } else {
      result = await db
        .collection(COLLECTION_POSTS)
        .find({ user_id: new ObjectID(user._id) })
        .sort({
          created_at: -1,
        })
        .toArray()

      await mergePostsWithAuthors(result, db)
    }

    db.close()

    return result
  },
  async searchQuery(query) {
    const db = await connect()
    const result = await db
      .collection(COLLECTION_POSTS)
      .find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
      .sort({
        score: { $meta: 'textScore' },
        created_at: -1,
      })
      .toArray()
      .then(posts => highlightTerms(posts, query))
    await mergePostsWithAuthors(result, db)
    db.close()

    return result
  },
  async searchHashtag(query) {
    const db = await connect()
    const result = await db
      .collection(COLLECTION_POSTS)
      .find({ hashtags: { $in: [query.toLowerCase()] } })
      .sort({
        created_at: -1,
      })
      .toArray()
      .then(posts => highlightTerms(posts, query))
    await mergePostsWithAuthors(result, db)
    db.close()

    return result
  },
  async add(rawPost) {
    const post = {
      ...rawPost,
      user_id: new ObjectID(rawPost.user_id),
      reply_count: 0,
      star_count: 0,
      created_at: new Date(),
    }

    post.parent_id && (post.parent_id = new ObjectID(post.parent_id))

    // TODO: populate hashtags
    const hashtags = []

    if (hashtags) {
      Object.assign(post, hashtags)
    }

    const db = await connect()
    const result = await db.collection(COLLECTION_POSTS).insert(post)

    if (post.parent_id) {
      await db
        .collection(COLLECTION_POSTS)
        .update(
          { _id: new ObjectID(post.parent_id) },
          { $inc: { reply_count: 1 } }
        )
    }

    db.close()

    return result
  },
}

module.exports = Posts
