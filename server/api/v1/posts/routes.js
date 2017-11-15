const Posts = require('.')

module.exports = (fastify, opts, next) => {
  fastify
    .get('/posts', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getFeed({
        as: request.query.as,
        since: request.query.since,
        limit: request.query.limit,
      })
    })
    .get('/posts/:id', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.get(
        {
          _id: request.params.id,
        },
        {
          as: request.query.as,
        }
      )
    })
    .get('/posts/:id/replies', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getReplies(
        {
          parent_id: request.params.id,
        },
        {
          as: request.query.as,
          since: request.query.since,
          limit: request.query.limit,
        }
      )
    })
    .get('/posts/:id/favorites', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getFavorites({
        post_id: request.params.id,
      })
    })
    .get('/users/@:username/posts', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getUserFeed(
        {
          username: request.params.username,
        },
        {
          as: request.query.as,
          since: request.query.since,
          limit: request.query.limit,
        }
      )
    })
    .get('/search/:query', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.searchQuery(
        { query: request.params.query },
        {
          as: request.query.as,
          since: request.query.since,
          limit: request.query.limit,
        }
      )
    })
    .get('/hashtags/:hashtag', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.searchHashtag(
        { query: request.params.hashtag },
        {
          as: request.query.as,
          since: request.query.since,
          limit: request.query.limit,
        }
      )
    })

  fastify.post('/posts', async (request, reply) => {
    reply.type('application/json').code(201)
    return Posts.add(request.body)
  })

  next()
}
