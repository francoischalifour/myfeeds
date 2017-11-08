const { MongoClient } = require('mongodb')
const connect = require('./connect')

const DB_COLLECTIONS = ['users', 'posts', 'stars']

const run = async () => {
  const db = await connect()

  for (let name of DB_COLLECTIONS) {
    console.log(`💾 Populating collection "${name}"...`)
    const data = require(`./fixtures/${name}.json`)
    await db.collection(name).insertMany(data)
  }

  await db.close().catch(err => console.error(err))
  console.log('🛑 Connection closed.')
}

run()
