const { objectifyProps } = require('../../../utils')
const { COLLECTION_USERS } = require('../../../constants')

const Users = {
  async get(objectFilter, { db }) {
    const filter = objectifyProps(objectFilter)
    const result = await db.collection(COLLECTION_USERS).findOne(filter)

    return result
  },
  async getPublic(objectFilter, { db }) {
    const filter = objectifyProps(objectFilter)
    const result = await db.collection(COLLECTION_USERS).findOne(filter, {
      _id: 0,
      username: 1,
      name: 1,
      description: 1,
      profile_image_url: 1,
      location: 1,
    })

    return result
  },
}

module.exports = Users
