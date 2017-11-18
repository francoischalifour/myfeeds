const bcrypt = require('bcryptjs')
const { APIError, objectifyProps } = require('../../../utils')
const { COLLECTION_USERS } = require('../../../constants')

const Auth = {
  async getAccount({ email = '', password = '' } = {}, { db }) {
    const account = await db.collection(COLLECTION_USERS).findOne({
      email: new RegExp(['^', email, '$'].join(''), 'i'),
    })

    if (!account) {
      throw new APIError({
        code: 400,
        message:
          'This email address is not registered. Did you mean to sign up?',
      })
    }

    const passwordMatched = await bcrypt.compare(password, account.password)

    if (passwordMatched) {
      delete account.password
      return account
    } else {
      throw new APIError({
        code: 400,
        message: 'Invalid email address or password.',
      })
    }
  },
  async addAccount(
    { name = '', username = '', email = '', password = '' } = {},
    { db }
  ) {
    const properties = arguments[0]
    Object.keys(properties).forEach(prop => {
      if (!properties[prop] || properties[prop].length < 2) {
        throw new APIError({
          code: 400,
          message: `The ${prop} is not valid.`,
        })
      }
    })

    const hash = await bcrypt.hash(password, 10)

    try {
      const result = await db.collection(COLLECTION_USERS).insertOne({
        name,
        username,
        email,
        description: '',
        location: '',
        url: '',
        profile_image_url: '',
        password: hash,
      })

      const user = result.ops[0]
      delete user.password

      return user
    } catch (err) {
      throw new APIError({
        code: 400,
        message: 'This user is already registered.',
      })
    }
  },
  async updateAccount(info = {}, { db }) {
    const requiredProperties = ['name', 'username', 'email']
    requiredProperties.forEach(prop => {
      if (!info[prop] || info[prop].length < 2) {
        throw new APIError({
          code: 400,
          message: `The ${prop} is not valid.`,
        })
      }
    })
    const user = objectifyProps(info)

    const result = await db
      .collection(COLLECTION_USERS)
      .updateOne({ _id: user._id }, { $set: user })

    if (result) {
      return user
    }

    throw new APIError({
      code: 400,
      message: 'An error has occurred updating your profile.',
    })
  },
}

module.exports = Auth
