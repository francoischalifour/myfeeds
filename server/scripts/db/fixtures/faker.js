const faker = require('faker')
const { ObjectID } = require('mongodb')

const permanentUsers = [
  {
    _id: new ObjectID(),
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
    _id: new ObjectID(),
    username: 'michaelbouffard',
    name: 'Michael Bouffard',
    email: 'michaelbouffard1992@gmail.com',
    password: 'michael',
    created_at: faker.date.recent(),
  },
]

const USER_COUNT = 40 - permanentUsers.length
const POST_COUNT = 50
const REPLY_COUNT = 40

const users = Array.from({ length: USER_COUNT }).map((_v, i) => {
  return {
    _id: new ObjectID(),
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
  const userIndex = faker.random.number(USER_COUNT - 2)

  return {
    _id: new ObjectID(),
    text: faker.random.words(),
    user_id: users[userIndex]._id,
    reply_count: 0,
    star_count: 0,
    created_at: faker.date.between(2017, new Date()),
  }
})

const replies = Array.from({ length: REPLY_COUNT }).map((_v, i) => {
  const userIndex = faker.random.number(USER_COUNT - 2)
  const parentId = faker.random.number(POST_COUNT - 2)

  posts[parentId].reply_count++

  return {
    _id: new ObjectID(),
    text: faker.random.words(),
    user_id: users[userIndex]._id,
    parent_id: posts[parentId]._id,
    reply_count: 0,
    star_count: 0,
    created_at: faker.date.between(2017, new Date()),
  }
})

module.exports = {
  users: users.concat(permanentUsers),
  posts: posts.concat(replies),
}
