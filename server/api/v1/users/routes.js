const Users = require('.')
const Posts = require('../posts')

module.exports = (fastify, opts, next) => {
  fastify
    .get('/users/:id', async (request, reply) => {
      reply.type('application/json').code(200)
      return Users.getById(request.params.id)
    })
    .get('/users/@:username', async (request, reply) => {
      reply.type('application/json').code(200)
      return Users.getByUsername(request.params.username)
    })
    .get('/users/:id/public', async (request, reply) => {
      reply.type('application/json').code(200)
      return Users.getPublicById(request.params.id)
    })
    .get('/users/@:username/posts', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getUserFeedByUsername(request.params.username)
    })

  fastify.post('/login', async (request, reply) => {
    reply.type('application/json').code(200)
    // TODO: check password
    return Users.getByEmail(request.body.email)
  })

  next()
}
