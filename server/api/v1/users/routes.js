const Users = require('.')

module.exports = (fastify, opts, next) => {
  fastify
    .get('/users/:id', async (request, reply) => {
      reply.type('application/json').code(200)
      try {
        return await Users.get(
          {
            _id: request.params.id,
          },
          {
            db: fastify.mongo.db,
            as: request.query.as,
          }
        )
      } catch (err) {
        reply.type('application/json').code(err.code)
        return err
      }
    })
    .get('/users/@:username', async (request, reply) => {
      reply.type('application/json').code(200)
      try {
        return await Users.get(
          {
            username: request.params.username,
          },
          {
            db: fastify.mongo.db,
            as: request.query.as,
          }
        )
      } catch (err) {
        reply.type('application/json').code(err.code)
        return err
      }
    })

  next()
}
