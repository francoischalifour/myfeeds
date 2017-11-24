const Posts = require('../posts')

module.exports = (fastify, opts, next) => {
  fastify
    .get('/moments/best', async (request, reply) => {
      reply.type('application/json').code(200)
      return await Posts.getAllBest(
        {},
        {
          db: fastify.mongo.db,
          as: request.query.as,
          since: request.query.since,
          limit: request.query.limit,
          sort: request.query.sort,
        }
      )
    })
    .get('/moments/controversed', async (request, reply) => {
      reply.type('application/json').code(200)
      return await Posts.getAllControversed(
        {},
        {
          db: fastify.mongo.db,
          as: request.query.as,
          since: request.query.since,
          limit: request.query.limit,
          sort: request.query.sort,
        }
      )
    })
    .get('/moments/popular', async (request, reply) => {
      reply.type('application/json').code(200)
      return await Posts.getAllPopular(
        {},
        {
          db: fastify.mongo.db,
          as: request.query.as,
          since: request.query.since,
          limit: request.query.limit,
          sort: request.query.sort,
        }
      )
    })

  next()
}
