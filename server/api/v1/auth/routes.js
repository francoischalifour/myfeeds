const Auth = require('.')

module.exports = (fastify, opts, next) => {
  fastify
    .post('/login', async (request, reply) => {
      reply.type('application/json').code(200)
      try {
        return await Auth.getAccount(
          {
            email: request.body.email,
            password: request.body.password,
          },
          {
            db: fastify.mongo.db,
          }
        )
      } catch (err) {
        reply.type('application/json').code(err.code)
        return err
      }
    })
    .post('/signup', async (request, reply) => {
      reply.type('application/json').code(201)
      try {
        return await Auth.addAccount(
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
      } catch (err) {
        reply.type('application/json').code(err.code)
        return err
      }
    })
    .post('/update', async (request, reply) => {
      reply.type('application/json').code(200)
      try {
        return await Auth.updateAccount(request.body, {
          db: fastify.mongo.db,
        })
      } catch (err) {
        reply.type('application/json').code(err.code)
        return err
      }
    })

  next()
}
