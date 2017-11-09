require('dotenv').config()
const fastify = require('fastify')()
const cors = require('cors')
const Posts = require('./api/v1/posts')
const Users = require('./api/v1/users')

const { SERVER_HOST, SERVER_PORT } = process.env

fastify.use(cors())

fastify.get('/status', async (request, reply) => {
  reply.type('application/json').code(200)
  return true
})

fastify.get('/posts', async (request, reply) => {
  reply.type('application/json').code(200)
  return Posts.getAll()
})

fastify.get('/posts/:id', async (request, reply) => {
  reply.type('application/json').code(200)
  return Posts.getById(request.params.id)
})

fastify.get('/posts/:id/replies', async (request, reply) => {
  reply.type('application/json').code(200)
  return Posts.getRepliesById(request.params.id)
})

fastify.get('/users/:id', async (request, reply) => {
  reply.type('application/json').code(200)
  return Users.getById(request.params.id)
})

fastify.get('/users/@:username', async (request, reply) => {
  reply.type('application/json').code(200)
  return Users.getByUsername(request.params.username)
})

fastify.get('/users/email/:email', async (request, reply) => {
  reply.type('application/json').code(200)
  return Users.getByEmail(request.params.email)
})

fastify.get('/users/:id/public', async (request, reply) => {
  reply.type('application/json').code(200)
  return Users.getPublicById(request.params.id)
})

fastify.get('/users/@:username/posts', async (request, reply) => {
  reply.type('application/json').code(200)
  return Posts.getAllByUsername(request.params.username)
})

fastify.get('/search/:query', async (request, reply) => {
  reply.type('application/json').code(200)
  return Posts.searchQuery(request.params.query)
})

fastify.listen(SERVER_PORT, SERVER_HOST, err => {
  if (err) {
    throw err
  }

  console.log(`🖥 Server listening on ${fastify.server.address().port}...`)
})
