const { ObjectId } = require('mongodb')
const connect = require('../../../utils/connect')
const { objectifyProps } = require('../../../utils')
const {
  COLLECTION_POSTS,
  COLLECTION_USERS,
  COLLECTION_FAVORITES,
} = require('../../../constants')
const {
  getAuthorData,
  getPostsWithAuthors,
  getSinglePostWithMetadata,
  getPostsWithMetadata,
  highlightTerms,
} = require('./utils')

const Posts = {
  async getFeed(outputFilter = {}) {
    const db = await connect()
    const posts = await db
      .collection(COLLECTION_POSTS)
      .find({
        parent_id: { $exists: false },
      })
      .sort({
        created_at: -1,
      })
      .toArray()
    let result = await getPostsWithAuthors(posts, db)

    if (outputFilter.as) {
      result = await getPostsWithMetadata(
        result,
        ObjectId(outputFilter.as.user_id),
        db
      )
    }

    db.close()

    return result
  },
  async get(dataFilter, outputFilter = {}) {
    const filter = objectifyProps(dataFilter)

    const db = await connect()
    const post = await db.collection(COLLECTION_POSTS).findOne(filter)
    const author = await db
      .collection(COLLECTION_USERS)
      .findOne({ _id: post.user_id })
    let result = { ...post, ...getAuthorData(author) }
    delete result.user_id

    if (outputFilter.as) {
      result = await getSinglePostWithMetadata(
        result,
        ObjectId(outputFilter.as.user_id),
        db
      )
    }
    db.close()

    return result
  },
  async getReplies(dataFilter, outputFilter = {}) {
    const filter = objectifyProps(dataFilter)

    const db = await connect()
    const posts = await db
      .collection(COLLECTION_POSTS)
      .find(filter)
      .sort({
        created_at: 1,
      })
      .toArray()
    let result = await getPostsWithAuthors(posts, db)

    if (outputFilter.as) {
      result = await getPostsWithMetadata(
        result,
        ObjectId(outputFilter.as.user_id),
        db
      )
    }
    db.close()

    return result
  },
  async getUserFeed(dataFilter, outputFilter = {}) {
    const filter = objectifyProps(dataFilter)

    const db = await connect()
    const user = await db
      .collection(COLLECTION_USERS)
      .findOne(filter, { _id: 1 })
    let result

    if (!user) {
      result = []
    } else {
      const posts = await db
        .collection(COLLECTION_POSTS)
        .find({ user_id: ObjectId(user._id) })
        .sort({
          created_at: -1,
        })
        .toArray()

      result = await getPostsWithAuthors(posts, db)

      if (outputFilter.as) {
        result = await getPostsWithMetadata(
          result,
          ObjectId(outputFilter.as.user_id),
          db
        )
      }
    }

    db.close()

    return result
  },
  async searchQuery(query, outputFilter = {}) {
    const db = await connect()
    const posts = await db
      .collection(COLLECTION_POSTS)
      .find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
      .sort({
        score: { $meta: 'textScore' },
        created_at: -1,
      })
      .toArray()
      .then(posts => highlightTerms(posts, query))
    let result = await getPostsWithAuthors(posts, db)

    if (outputFilter.as) {
      result = await getPostsWithMetadata(
        result,
        ObjectId(outputFilter.as.user_id),
        db
      )
    }
    db.close()

    return result
  },
  async searchHashtag(query, outputFilter = {}) {
    const db = await connect()
    const posts = await db
      .collection(COLLECTION_POSTS)
      .find({ hashtags: { $in: [query.toLowerCase()] } })
      .sort({
        created_at: -1,
      })
      .toArray()
      .then(posts => highlightTerms(posts, query))
    let result = await getPostsWithAuthors(posts, db)

    if (outputFilter.as) {
      result = await getPostsWithMetadata(
        result,
        ObjectId(outputFilter.as.user_id),
        db
      )
    }
    db.close()

    return result
  },
  async add(rawPost) {
    const post = objectifyProps({
      ...rawPost,
      reply_count: 0,
      star_count: 0,
      created_at: new Date(),
    })

    const hashtags = (post.text.match(/(^|\s)(#[a-z\d-]+)/gi) || []).map(tag =>
      tag
        .trim()
        .substr(1)
        .toLowerCase()
    )
    hashtags.length > 0 && (post.hashtags = hashtags)

    const db = await connect()
    const result = await db.collection(COLLECTION_POSTS).insert(post)

    if (post.parent_id) {
      await db
        .collection(COLLECTION_POSTS)
        .update({ _id: post.parent_id }, { $inc: { reply_count: 1 } })
    }

    db.close()

    return result
  },
}

module.exports = Posts
