const Posts = require('.')

module.exports = (fastify, opts, next) => {
  fastify
    .get('/status', async (request, reply) => {
      reply.type('application/json').code(200)
      return true
    })
    .get('/posts', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getFeed()
    })
    .get('/posts/as/:userid', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getFeed({
        as: {
          user_id: request.params.userid,
        },
      })
    })
    .get('/posts/:id', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.get({
        _id: request.params.id,
      })
    })
    .get('/posts/:id/as/:userid', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.get(
        {
          _id: request.params.id,
        },
        {
          as: {
            user_id: request.params.userid,
          },
        }
      )
    })
    .get('/posts/:id/replies', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getReplies({
        parent_id: request.params.id,
      })
    })
    .get('/posts/:id/replies/as/:userid', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getReplies(
        {
          parent_id: request.params.id,
        },
        {
          as: {
            user_id: request.params.userid,
          },
        }
      )
    })
    .get('/search/:query', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.searchQuery(request.params.query)
    })
    .get('/search/:query/as/:userid', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.searchQuery(request.params.query, {
        as: { user_id: request.params.userid },
      })
    })
    .get('/hashtags/:hashtag', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.searchHashtag(request.params.hashtag)
    })
    .get('/hashtags/:hashtag/as/:userid', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.searchHashtag(request.params.hashtag, {
        as: {
          user_id: request.params.userid,
        },
      })
    })
    .get('/users/@:username/posts', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getUserFeed({
        username: request.params.username,
      })
    })
    .get('/users/@:username/posts/as/:userid', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getUserFeed(
        {
          username: request.params.username,
        },
        {
          as: {
            user_id: request.params.userid,
          },
        }
      )
    })

  fastify.post('/posts', async (request, reply) => {
    reply.type('application/json').code(200)
    return Posts.add(request.body)
  })

  next()
}
