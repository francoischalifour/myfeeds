const Users = require('.')

module.exports = (fastify, opts, next) => {
  fastify.post('/login', async (request, reply) => {
    reply.type('application/json').code(200)
    return Users.getAccount(
      {
        email: request.body.email,
        password: request.body.password,
      },
      {
        db: fastify.mongo.db,
      }
    )
  })

  next()
}
