/**
 * This script populates the database with fake data from `fixtures/`.
 */
const { MongoClient, ObjectID } = require('mongodb')
const connect = require('../../utils/connect')
const {
  COLLECTION_USERS,
  COLLECTION_POSTS,
  COLLECTION_STARS,
} = require('../../constants')

const DB_COLLECTIONS = [COLLECTION_USERS, COLLECTION_POSTS, COLLECTION_STARS]

const run = async () => {
  const db = await connect()

  for (let name of DB_COLLECTIONS) {
    console.log(`💾 Populating collection "${name}"...`)
    const data = require(`./fixtures/${name}.json`)
    data.forEach(obj => {
      obj._id = new ObjectID(obj._id)
      obj.user_id && (obj.user_id = new ObjectID(obj.user_id))
      obj.parent_id && (obj.parent_id = new ObjectID(obj.parent_id))
      obj.post_id && (obj.post_id = new ObjectID(obj.post_id))
    })

    await db.collection(name).insertMany(data)
  }

  await db.close().catch(err => console.error(err))
  console.log('\n👍 All done!')
}

run()
