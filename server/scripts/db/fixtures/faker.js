const faker = require('faker')
const bcrypt = require('bcryptjs')
const { ObjectId } = require('mongodb')

const USER_COUNT = 100
const POST_COUNT = 500
const REPLY_COUNT = 750
const STAR_COUNT = 800

const users = Array.from({ length: USER_COUNT }).map(() => {
  const createdAt = faker.date.between(2017, new Date())

  return {
    _id: ObjectId(createdAt.getTime() / 1000),
    username: faker.internet.userName(),
    name: faker.name.findName(),
    description: faker.random.words(),
    profile_image_url: faker.internet.avatar(),
    location: faker.address.state(),
    url: faker.internet.url(),
    email: faker.internet.email(),
    password: bcrypt.hashSync(faker.internet.password(), 10),
    created_at: createdAt,
  }
})

const posts = Array.from({ length: POST_COUNT }).map(() => {
  const createdAt = faker.date.between(2017, new Date())
  const userIndex = faker.random.number(USER_COUNT - 2)

  return {
    _id: ObjectId(createdAt.getTime() / 1000),
    text: faker.random.words(),
    user_id: users[userIndex]._id,
    reply_count: 0,
    star_count: 0,
    created_at: createdAt,
  }
})

const replies = Array.from({ length: REPLY_COUNT }).map(() => {
  const createdAt = faker.date.between(2017, new Date())
  const userIndex = faker.random.number(USER_COUNT - 1)
  const parentPostIndex = faker.random.number(POST_COUNT - 2)

  posts[parentPostIndex].reply_count++

  return {
    _id: ObjectId(createdAt.getTime() / 1000),
    text: faker.random.words(),
    user_id: users[userIndex]._id,
    parent_id: posts[parentPostIndex]._id,
    reply_count: 0,
    star_count: 0,
    created_at: createdAt,
  }
})

const favorites = Array.from({ length: STAR_COUNT }).map(() => {
  const createdAt = faker.date.between(2017, new Date())
  const userIndex = faker.random.number(USER_COUNT - 2)
  const postIndex = faker.random.number(POST_COUNT - 2)
  const postCollection = [posts, replies][faker.random.number(1)]

  postCollection[postIndex].star_count++

  return {
    _id: ObjectId(createdAt.getTime() / 1000),
    user_id: users[userIndex]._id,
    post_id: postCollection[postIndex]._id,
    created_at: createdAt,
  }
})

module.exports = {
  users,
  posts: [...posts, ...replies],
  favorites,
}
