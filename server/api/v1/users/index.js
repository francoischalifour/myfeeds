const { APIError, objectifyProps } = require('../../../utils')
const { COLLECTION_USERS } = require('../../../constants')

const Users = {
  async get(objectFilter, { db }) {
    const filter = objectifyProps(objectFilter)
    const result = await db.collection(COLLECTION_USERS).findOne(filter, {
      _id: 1,
      name: 1,
      username: 1,
      description: 1,
      profile_image_url: 1,
      location: 1,
      url: 1,
    })

    if (!result) {
      throw new APIError({
        code: 404,
        message: "This user doesn't exist.",
      })
    }

    return result
  },
}

module.exports = Users
