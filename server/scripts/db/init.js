/**
 * This script initializes the database:
 *  - Drops all existing collections
 *  - Creates the necessary collections
 *  - Creates indexes
 */
const { MongoClient } = require('mongodb')
const connect = require('../../utils/connect')
const {
  COLLECTION_USERS,
  COLLECTION_POSTS,
  COLLECTION_FAVORITES,
} = require('../../constants')

const DB_COLLECTIONS = [
  COLLECTION_USERS,
  COLLECTION_POSTS,
  COLLECTION_FAVORITES,
]

const createIndexes = async db => {
  /**
   * Users
   */
  await db
    .collection(COLLECTION_USERS)
    .createIndex({ username: 1 }, { unique: true })
    .catch(err => console.error(err))
  await db
    .collection(COLLECTION_USERS)
    .createIndex({ email: 1 }, { unique: true })
    .catch(err => console.error(err))

  /**
   * Posts
   */
  await db
    .collection(COLLECTION_POSTS)
    .createIndex({ text: 'text' })
    .catch(err => console.error(err))
  // To retrieve post's user metadata
  await db
    .collection(COLLECTION_POSTS)
    .createIndex({ user_id: 1, parent_id: 1 }, { unique: true })
    .catch(err => console.error(err))

  /**
   * Stars
   */
  await db
    .collection(COLLECTION_FAVORITES)
    .createIndex({ post_id: 1 })
    .catch(err => console.error(err))
  await db
    .collection(COLLECTION_FAVORITES)
    .createIndex({ post_id: 1, user_id: 1 }, { unique: true })
    .catch(err => console.error(err))
}

const run = async () => {
  const db = await connect()

  const collections = await db.collections().catch(err => console.error(err))

  for (let { s: { name } } of collections) {
    console.log(`🔥 Dropping collection "${name}"...`)
    await db.dropCollection(name).catch(err => console.error(err))
  }

  for (let name of DB_COLLECTIONS) {
    console.log(`📦 Creating collection "${name}"...`)
    await db.createCollection(name).catch(err => console.error(err))
  }

  console.log(`⚡️ Settings indexes...`)
  await createIndexes(db)

  await db.close().catch(err => console.error(err))
  console.log('\n👍 All done!')
}

run()
