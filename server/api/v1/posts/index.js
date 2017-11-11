const { ObjectID } = require('mongodb')
const connect = require('../../../utils/connect')
const { objectifyProps } = require('../../../utils')
const {
  COLLECTION_POSTS,
  COLLECTION_USERS,
  COLLECTION_FAVORITES,
} = require('../../../constants')
const {
  getAuthorData,
  mergePostsWithAuthors,
  highlightTerms,
} = require('./utils')

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
  async getUserData(objectFilter) {
    const filter = objectifyProps(objectFilter)

    const db = await connect()
    const hasFavorited = !!await db.collection(COLLECTION_FAVORITES).findOne({
      user_id: filter.user_id,
      post_id: filter.post_id,
    })
    const hasReplied = !!await db.collection(COLLECTION_POSTS).findOne({
      user_id: filter.user_id,
      parent_id: filter.post_id,
    })
    db.close()

    return {
      favorited: hasFavorited,
      replied: hasReplied,
    }
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
    const post = objectifyProps({
      ...rawPost,
      reply_count: 0,
      star_count: 0,
      created_at: new Date(),
    })

    // TODO: populate hashtags
    const hashtags = []
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
