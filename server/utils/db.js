require('dotenv').config()
const { MongoClient } = require('mongodb')

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env

const getConnectUrl = (
  {
    host = DB_HOST,
    port = DB_PORT,
    name = DB_NAME,
    user = DB_USER,
    password = DB_PASSWORD,
  } = {}
) => {
  if (!host || !port || !name) {
    throw new Error('🛑 Missing database connection information.')
  }

  const auth = user && password ? `${user}:${password}@` : ''

  return `mongodb://${auth}${host}:${port}/${name}`
}

/**
 * Returns an instance of the MongoDB database.
 *
 * By default, this instance is defined with environment variables.
 */
const connect = (
  {
    host = DB_HOST,
    port = DB_PORT,
    name = DB_NAME,
    user = DB_USER,
    password = DB_PASSWORD,
  } = {}
) => {
  const url = getConnectUrl({ host, port, name, user, password })
  const connection = MongoClient.connect(url).catch(console.error)

  return connection
}

module.exports = {
  connect,
  getConnectUrl,
}
