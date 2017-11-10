const { ObjectID } = require('mongodb')

/**
 * Returns an objectified version of the object.
 * Converts all `*_id` fields to MongoDB Objects.
 *
 * Example: { _id: '5a05b9d268392a465dc017a3' } → { _id: new ObjectID('5a05b9d268392a465dc017a3') }
 *
 * @param {object} props The properties of the object
 */
const objectifyProps = props => {
  return Object.keys(props).reduce((acc, key) => {
    if (key.slice(-3) === '_id') {
      acc[key] = new ObjectID(props[key])
    } else {
      acc[key] = props[key]
    }

    return acc
  }, {})
}

module.exports = {
  objectifyProps,
}
