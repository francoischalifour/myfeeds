const { ObjectId } = require('mongodb')

/**
 * Returns an objectified version of the object.
 * Converts all `*_id` fields to MongoDB Objects.
 *
 * Example: { _id: '5a05b9d268392a465dc017a3' } → { _id: ObjectId('5a05b9d268392a465dc017a3') }
 *
 * @param {object} props The properties of the object
 */
const objectifyProps = props => {
  return Object.keys(props).reduce((acc, key) => {
    if (key.slice(-3) === '_id' && ObjectId.isValid(props[key])) {
      acc[key] = ObjectId(props[key])
    } else {
      acc[key] = props[key]
    }

    return acc
  }, {})
}

/**
 * Custom error to handle bad API requests.
 */
class APIError extends Error {
  constructor({ code, message }) {
    super(message)

    this.name = 'APIError'
    this.code = code
  }
}

module.exports = {
  objectifyProps,
  APIError,
}
