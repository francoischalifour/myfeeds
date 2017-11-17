const Favorites = require('.')

module.exports = (fastify, opts, next) => {
  fastify
    .post('/favorites/create', async (request, reply) => {
      reply.type('application/json').code(201)
      return await Favorites.add(
        {
          post_id: request.body.postId,
          user_id: request.body.userId,
        },
        {
          db: fastify.mongo.db,
        }
      )
    })
    .post('/favorites/delete', async (request, reply) => {
      reply.type('application/json').code(200)
      return await Favorites.remove(
        {
          post_id: request.body.postId,
          user_id: request.body.userId,
        },
        {
          db: fastify.mongo.db,
        }
      )
    })

  next()
}
