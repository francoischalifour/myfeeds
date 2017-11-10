const { MongoClient, ObjectID } = require('mongodb')
const connect = require('../../../utils/connect')
const { COLLECTION_USERS } = require('../../../constants')

const Auth = {
  async getAccount(email, password) {
    const db = await connect()
    const result = await db.collection(COLLECTION_USERS).findOne({
      email,
      //password
    })
    db.close()

    return result
  },
}

module.exports = Auth
