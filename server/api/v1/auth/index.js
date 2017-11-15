const { COLLECTION_USERS } = require('../../../constants')

const Auth = {
  async getAccount({ email, password }, { db }) {
    const result = await db.collection(COLLECTION_USERS).findOne({
      email,
      //password
    })

    return result
  },
}

module.exports = Auth
