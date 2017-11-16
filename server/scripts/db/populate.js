/**
 * This script populates the database with fake data from `fixtures/`.
 */
const { connect } = require('../../utils/db')
const {
  COLLECTION_USERS,
  COLLECTION_POSTS,
  COLLECTION_FAVORITES,
} = require('../../constants')
const { users, posts, favorites } = require('./fixtures/faker')

const run = async () => {
  const db = await connect()

  console.log('💾 Populating collections')
  console.log(`  ▶ ${COLLECTION_USERS}`)
  await db
    .collection(COLLECTION_USERS)
    .insertMany(users)
    .catch(console.error)

  console.log(`  ▶ ${COLLECTION_POSTS}`)
  await db
    .collection(COLLECTION_POSTS)
    .insertMany(posts)
    .catch(console.error)

  console.log(`  ▶ ${COLLECTION_FAVORITES}`)
  await db
    .collection(COLLECTION_FAVORITES)
    .insertMany(favorites)
    .catch(console.error)

  await db.close().catch(console.error)
  console.log('\n👍 All done populating the database!\n')
}

run()
