const connect = require('../../../utils/connect')
const { objectifyProps } = require('../../../utils')
const { COLLECTION_USERS } = require('../../../constants')

const Users = {
  async get(objectFilter) {
    const filter = objectifyProps(objectFilter)

    const db = await connect()
    const result = await db.collection(COLLECTION_USERS).findOne(filter)
    db.close()

    return result
  },
  async getPublic(objectFilter) {
    const filter = objectifyProps(objectFilter)

    const db = await connect()
    const result = await db.collection(COLLECTION_USERS).findOne(filter, {
      _id: 0,
      username: 1,
      name: 1,
      description: 1,
      profile_image_url: 1,
      location: 1,
    })
    db.close()

    return result
  },
}

module.exports = Users
