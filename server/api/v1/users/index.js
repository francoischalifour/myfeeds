const { objectifyProps } = require('../../../utils')
const { COLLECTION_USERS } = require('../../../constants')

const Users = {
  async get(objectFilter, { db }) {
    const filter = objectifyProps(objectFilter)
    const result = await db.collection(COLLECTION_USERS).findOne(filter)

    return result
  },
}

module.exports = Users
