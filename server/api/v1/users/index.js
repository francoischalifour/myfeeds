const { MongoClient, ObjectID } = require('mongodb')
const connect = require('../../../utils/connect')
const { COLLECTION_USERS } = require('../../../constants')

const Users = {
  async getByUsername(username) {
    const db = await connect()
    const result = await db.collection(COLLECTION_USERS).findOne({ username })
    db.close()

    return result
  },
  async getById(id) {
    const db = await connect()
    const result = await db
      .collection(COLLECTION_USERS)
      .findOne({ _id: new ObjectID(id) })
    db.close()

    return result
  },
  async getByEmail(email) {
    const db = await connect()
    const result = await db.collection(COLLECTION_USERS).findOne({ email })
    db.close()

    return result
  },
  async getPublicById(id) {
    const db = await connect()
    const result = await db.collection(COLLECTION_USERS).findOne(
      { _id: new ObjectID(id) },
      {
        _id: 0,
        username: 1,
        name: 1,
        description: 1,
        profile_image_url: 1,
        location: 1,
      }
    )
    db.close()

    return result
  },
}

module.exports = Users
