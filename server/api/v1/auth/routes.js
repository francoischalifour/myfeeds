const Auth = require('.')

module.exports = (fastify, opts, next) => {
  fastify
    .post('/login', async (request, reply) => {
      reply.type('application/json').code(200)
      return Auth.getAccount(
        {
          email: request.body.email,
          password: request.body.password,
        },
        {
          db: fastify.mongo.db,
        }
      )
    })
    .post('/signup', async (request, reply) => {
      reply.type('application/json').code(201)
      return Auth.addAccount(
        {
          name: request.body.name,
          username: request.body.username,
          email: request.body.email,
          password: request.body.password,
        },
        {
          db: fastify.mongo.db,
        }
      )
    })
    .post('/update', async (request, reply) => {
      reply.type('application/json').code(200)
      return Auth.updateAccount(request.body, {
        db: fastify.mongo.db,
      })
    })

  next()
}
