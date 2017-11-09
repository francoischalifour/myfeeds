const { MongoClient } = require('mongodb')
const connect = require('../../../utils/connect')
const { COLLECTION_POSTS, COLLECTION_USERS } = require('../../../constants')

const Posts = {
  async getAll() {
    const db = await connect()
    const result = db
      .collection(COLLECTION_POSTS)
      .find({})
      .toArray()
    db.close()

    return result
  },
  async getById(id) {
    const db = await connect()
    const result = db.collection(COLLECTION_POSTS).findOne({ _id: id })
    db.close()

    return result
  },
  async getRepliesById(id) {
    const db = await connect()
    const result = db
      .collection(COLLECTION_POSTS)
      .find({ parent_id: id })
      .toArray()
    db.close()

    return result
  },
  async getAllByUsername(username) {
    const db = await connect()
    const user = await db
      .collection(COLLECTION_USERS)
      .findOne({ username }, { _id: 1 })
    const result = db
      .collection(COLLECTION_POSTS)
      .find({ user_id: user._id })
      .toArray()
    db.close()

    return result
  },
  async searchQuery(query) {
    const db = await connect()
    const result = db
      .collection(COLLECTION_POSTS)
      .find({ $text: { $search: query } })
      .toArray()
    db.close()

    return result
  },
}

module.exports = Posts
