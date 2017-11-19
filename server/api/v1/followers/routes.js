const Followers = require('.')

module.exports = (fastify, opts, next) => {
  fastify
    .post('/followers/create', async (request, reply) => {
      reply.type('application/json').code(201)
      return await Followers.add(
        {
          follower_id: request.body.followerId,
          user_id: request.body.userId,
        },
        {
          db: fastify.mongo.db,
        }
      )
    })
    .post('/followers/delete', async (request, reply) => {
      reply.type('application/json').code(200)
      return await Followers.remove(
        {
          follower_id: request.body.followerId,
          user_id: request.body.userId,
        },
        {
          db: fastify.mongo.db,
        }
      )
    })

  next()
}
