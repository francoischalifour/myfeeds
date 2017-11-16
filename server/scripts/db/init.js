/**
 * This script initializes the database:
 *  - Drops all existing collections
 *  - Creates the necessary collections
 *  - Creates indexes
 */
const { connect } = require('../../utils/db')
const indexes = require('./indexes')
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

const run = async () => {
  const db = await connect()

  const collections = (await db.collections().catch(console.error))
    .map(({ s: { name } }) => name)
    .filter(name => name !== 'system.indexes')

  console.log('🔥 Dropping collections')
  for (let name of collections) {
    console.log(`  ▶ ${name}`)
    await db.dropCollection(name).catch(console.error)
  }

  console.log('\n📦 Creating collections')
  for (let name of DB_COLLECTIONS) {
    console.log(`  ▶ ${name}`)
    await db.createCollection(name).catch(console.error)
  }

  console.log(`\n⚡️ Setting indexes`)
  for (let collection in indexes) {
    for (let index of indexes[collection]) {
      console.log(`  ▶ ${collection}: ${index.description}`)
      await db
        .collection(collection)
        .createIndex(...index.value)
        .catch(console.error)
    }
  }

  await db.close().catch(console.error)
  console.log('\n👍 All done initializing the database!\n')
}

run()
