/**
 * This script populates the database with fake data from `fixtures/`.
 */
const { MongoClient, ObjectID } = require('mongodb')
const connect = require('../../utils/connect')
const {
  COLLECTION_USERS,
  COLLECTION_POSTS,
  COLLECTION_FAVORITES,
} = require('../../constants')
const { users, posts, favorites } = require('./fixtures/faker')

const run = async () => {
  const db = await connect()

  console.log(`💾 Populating collection "${COLLECTION_USERS}"...`)
  await db.collection(COLLECTION_USERS).insertMany(users)

  console.log(`💾 Populating collection "${COLLECTION_POSTS}"...`)
  await db.collection(COLLECTION_POSTS).insertMany(posts)

  console.log(`💾 Populating collection "${COLLECTION_FAVORITES}"...`)
  await db.collection(COLLECTION_FAVORITES).insertMany(favorites)

  await db.close().catch(err => console.error(err))
  console.log('\n👍 All done!')
}

run()
