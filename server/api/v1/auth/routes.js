const Users = require('.')

module.exports = (fastify, opts, next) => {
  fastify.post('/login', async (request, reply) => {
    reply.type('application/json').code(200)
    return Users.getAccount(request.body.email, request.body.password)
  })

  next()
}
