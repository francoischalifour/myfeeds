const Stars = require('.')

module.exports = (fastify, opts, next) => {
  fastify
    .post('/stars', async (request, reply) => {
      reply.type('application/json').code(201)
      return Stars.add({
        post_id: request.body.post_id,
        user_id: request.body.user_id,
      })
    })
    .put('/stars', async (request, reply) => {
      reply.type('application/json').code(201)
      return Stars.remove({
        post_id: request.body.post_id,
        user_id: request.body.user_id,
      })
    })

  next()
}
