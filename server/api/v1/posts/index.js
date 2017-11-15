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
  async get(dataFilter, { as }) {
    const filter = objectifyProps(dataFilter)

    const db = await connect()
    const post = await db.collection(COLLECTION_POSTS).findOne(filter)
    const author = await db
      .collection(COLLECTION_USERS)
      .findOne({ _id: post.user_id })
    let result = { ...post, ...getAuthorData(author) }
    delete result.user_id

    if (as) {
      result = await getSinglePostWithMetadata(result, ObjectId(as), db)
    }
    db.close()

    return result
  },
  async getFavorites(dataFilter) {
    const filter = objectifyProps(dataFilter)

    const db = await connect()
    const favorites = await db
      .collection(COLLECTION_FAVORITES)
      .find(filter, { _id: 0, post_id: 0 })
      .sort({
        created_at: -1,
      })
      .toArray()
    let result = await getPostsWithAuthors(favorites, db)
    db.close()

    return result
  },
  async getFeed({ as, since, limit }) {
    const filter = {
      parent_id: { $exists: false },
    }
    since && (filter._id = { $lt: ObjectId(since) })

    const db = await connect()
    const posts = await db
      .collection(COLLECTION_POSTS)
      .find(filter)
      .sort({
        created_at: -1,
      })
      .limit(Number(limit))
      .toArray()
    let result = await getPostsWithAuthors(posts, db)

    if (as) {
      result = await getPostsWithMetadata(result, ObjectId(as), db)
    }

    db.close()

    return result
  },
  async getReplies({ parent_id }, { as, since, limit }) {
    const filter = {
      parent_id: ObjectId(parent_id),
    }
    since && (filter._id = { $gt: ObjectId(since) })

    const db = await connect()
    const posts = await db
      .collection(COLLECTION_POSTS)
      .find(filter)
      .sort({
        created_at: 1,
      })
      .limit(Number(limit))
      .toArray()
    let result = await getPostsWithAuthors(posts, db)

    if (as) {
      result = await getPostsWithMetadata(result, ObjectId(as), db)
    }

    db.close()

    return result
  },
  async getUserFeed(filter, { as, since, limit }) {
    const db = await connect()
    const user = await db
      .collection(COLLECTION_USERS)
      .findOne(filter, { _id: 1 })
    let result

    if (!user._id) {
      result = []
    } else {
      const postsFilter = { user_id: ObjectId(user._id) }
      since && (postsFilter._id = { $gt: ObjectId(since) })

      const posts = await db
        .collection(COLLECTION_POSTS)
        .find(postsFilter)
        .sort({
          created_at: -1,
        })
        .limit(Number(limit))
        .toArray()

      result = await getPostsWithAuthors(posts, db)

      if (as) {
        result = await getPostsWithMetadata(result, ObjectId(as), db)
      }
    }

    db.close()

    return result
  },
  async searchQuery({ query }, { as, since, limit }) {
    const filter = { $text: { $search: query } }
    since && (filter._id = { $gt: ObjectId(since) })

    const db = await connect()
    const posts = await db
      .collection(COLLECTION_POSTS)
      .find(filter, { score: { $meta: 'textScore' } })
      .sort({
        score: { $meta: 'textScore' },
        created_at: -1,
      })
      .limit(Number(limit))
      .toArray()
      .then(posts => highlightTerms(posts, query))
    let result = await getPostsWithAuthors(posts, db)

    if (as) {
      result = await getPostsWithMetadata(result, ObjectId(as), db)
    }
    db.close()

    return result
  },
  async searchHashtag({ query }, { as, since, limit }) {
    const filter = { hashtags: { $in: [query.toLowerCase()] } }
    since && (filter._id = { $gt: ObjectId(since) })

    const db = await connect()
    const posts = await db
      .collection(COLLECTION_POSTS)
      .find(filter)
      .sort({
        created_at: -1,
      })
      .limit(Number(limit))
      .toArray()
      .then(posts => highlightTerms(posts, query))
    let result = await getPostsWithAuthors(posts, db)

    if (as) {
      result = await getPostsWithMetadata(result, ObjectId(as), db)
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
    const result = await db.collection(COLLECTION_POSTS).insertOne(post)

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
