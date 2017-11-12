const faker = require('faker')
const { ObjectId } = require('mongodb')

const PERMANENT_USERS = [
  {
    _id: ObjectId(),
    username: 'francoischalifour',
    name: 'François Chalifour',
    description:
      'Freelancer • CS Student • Code • Design • 🎷 • 🎸 – GitHub: https://github.com/francoischalifour',
    profile_image_url:
      'https://pbs.twimg.com/profile_images/870713221333884928/AUeuxQ0f_400x400.jpg',
    location: 'Québec, Canada',
    url: 'https://francoischalifour.com',
    email: 'francois.chalifour@gmail.com',
    password: 'francois',
    created_at: faker.date.recent(),
  },
  {
    _id: ObjectId(),
    username: 'michaelbouffard',
    name: 'Michael Bouffard',
    email: 'michaelbouffard1992@gmail.com',
    password: 'michael',
    created_at: faker.date.recent(),
  },
]

const USER_COUNT = 40 - PERMANENT_USERS.length
const POST_COUNT = 50
const REPLY_COUNT = 200
const STAR_COUNT = 200

const users = Array.from({ length: USER_COUNT }).map((_v, i) => {
  return {
    _id: ObjectId(),
    username: faker.internet.userName(),
    name: faker.name.findName(),
    description: faker.random.words(),
    profile_image_url: faker.internet.avatar(),
    location: faker.address.state(),
    url: faker.internet.url(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    created_at: faker.date.between(2017, new Date()),
  }
})

const posts = Array.from({ length: POST_COUNT }).map((_v, i) => {
  const userIndex = faker.random.number(USER_COUNT - 1)

  return {
    _id: ObjectId(),
    text: faker.random.words(),
    user_id: users[userIndex]._id,
    reply_count: 0,
    star_count: 0,
    created_at: faker.date.between(2017, new Date()),
  }
})

const replies = Array.from({ length: REPLY_COUNT }).map((_v, i) => {
  const userIndex = faker.random.number(USER_COUNT - 1)
  const parentPostIndex = faker.random.number(POST_COUNT - 1)

  posts[parentPostIndex].reply_count++

  return {
    _id: ObjectId(),
    text: faker.random.words(),
    user_id: users[userIndex]._id,
    parent_id: posts[parentPostIndex]._id,
    reply_count: 0,
    star_count: 0,
    created_at: faker.date.between(2017, new Date()),
  }
})

const favorites = Array.from({ length: STAR_COUNT }).map((_v, i) => {
  const userIndex = faker.random.number(USER_COUNT - 1)
  const postIndex = faker.random.number(POST_COUNT - 1)
  const postCollection = [posts, replies][faker.random.number(1)]

  postCollection[postIndex].star_count++

  return {
    _id: ObjectId(),
    user_id: users[userIndex]._id,
    post_id: posts[postIndex]._id,
    created_at: faker.date.between(2017, new Date()),
  }
})

module.exports = {
  users: users.concat(PERMANENT_USERS),
  posts: posts.concat(replies),
  favorites,
}
