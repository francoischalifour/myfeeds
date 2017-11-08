const { MongoClient } = require('mongodb')
const connect = require('./connect')

const DB_COLLECTIONS = ['users', 'posts', 'stars']

const run = async () => {
  const db = await connect()

  const collections = await db.collections().catch(err => console.error(err))

  for (let { s: { name } } of collections) {
    console.log(`🔥 Dropping collection "${name}"...`)
    await db.createCollection(name).catch(err => console.error(err))
  }

  for (let name of DB_COLLECTIONS) {
    console.log(`🎉 Creating collection "${name}"...`)
    await db.createCollection(name).catch(err => console.error(err))
  }

  await db.close().catch(err => console.error(err))
  console.log('🛑 Connection closed.')
}

run()
