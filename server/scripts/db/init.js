const { MongoClient } = require('mongodb')
const connect = require('../../utils/connect')
const {
  COLLECTION_USERS,
  COLLECTION_POSTS,
  COLLECTION_STARS,
} = require('../../constants')

const DB_COLLECTIONS = [COLLECTION_USERS, COLLECTION_POSTS, COLLECTION_STARS]

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
  await db.collection(COLLECTION_POSTS).createIndex({ text: 'text' })

  await db.close().catch(err => console.error(err))
  console.log('\n👍 All done!')
}

run()
