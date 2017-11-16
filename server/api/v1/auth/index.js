const bcrypt = require('bcryptjs')
const { COLLECTION_USERS } = require('../../../constants')

const Auth = {
  async getAccount({ email, password }, { db }) {
    const account = await db.collection(COLLECTION_USERS).findOne({
      email: new RegExp(['^', email, '$'].join(''), 'i'),
    })

    if (!account) {
      return {
        error: {
          message:
            'This email address is not registered. Did you mean to sign up?',
        },
      }
    }

    const passwordMatched = await bcrypt.compare(password, account.password)

    if (passwordMatched) {
      delete account.password
      return account
    }

    return {
      error: {
        message: 'Invalid email address or password.',
      },
    }
  },
  async addAccount({ name, username, email, password }, { db }) {
    const hash = await bcrypt.hash(password, 10)

    try {
      const result = await db.collection(COLLECTION_USERS).insertOne({
        name,
        username,
        email,
        password: hash,
      })

      const user = result.ops[0]
      delete user.password

      return user
    } catch (err) {
      return {
        error: {
          message: 'This user is already registered.',
        },
      }
    }
  },
}

module.exports = Auth
