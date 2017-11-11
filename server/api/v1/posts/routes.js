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
    .get('/posts/:id', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.get({
        _id: request.params.id,
      })
    })
    .get('/posts/:id/userdata/:userid', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getUserData({
        post_id: request.params.id,
        user_id: request.params.userid,
      })
    })
    .get('/posts/:id/replies', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getReplies({
        parent_id: request.params.id,
      })
    })
    .get('/search/:query', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.searchQuery(request.params.query)
    })
    .get('/hashtags/:hashtag', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.searchHashtag(request.params.hashtag)
    })

  fastify.post('/posts', async (request, reply) => {
    reply.type('application/json').code(200)
    return Posts.add(request.body)
  })

  next()
}
