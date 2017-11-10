require('dotenv').config()
const { MongoClient } = require('mongodb')

const { DB_HOST, DB_PORT, DB_NAME } = process.env

/**
 * Returns an instance of the MongoDB database.
 *
 * By default, this instance is defined with environment variables.
 */
const connect = (host = DB_HOST, port = DB_PORT, name = DB_NAME) => {
  if (!host || !port || !name) {
    throw new Error('⚠️ Missing database connection information.')
  }

  return MongoClient.connect(`mongodb://${host}:${port}/${name}`)
}

module.exports = connect
