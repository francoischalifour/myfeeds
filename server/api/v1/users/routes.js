const Users = require('.')
const Posts = require('../posts')

module.exports = (fastify, opts, next) => {
  fastify
    .get('/users/:id', async (request, reply) => {
      reply.type('application/json').code(200)
      return Users.get({
        _id: request.params.id,
      })
    })
    .get('/users/@:username', async (request, reply) => {
      reply.type('application/json').code(200)
      return Users.get({
        username: request.params.username,
      })
    })
    .get('/users/:id/public', async (request, reply) => {
      reply.type('application/json').code(200)
      return Users.getPublic({
        _id: request.params.id,
      })
    })

  next()
}
