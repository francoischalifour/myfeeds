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
      return Posts.getById(request.params.id)
    })
    .get('/posts/:id/replies', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getRepliesById(request.params.id)
    })
    .get('/search/:query', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.searchQuery(request.params.query)
    })
    .get('/hashtags/:hashtag', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.searchHashtag(request.params.hashtag)
    })

  next()
}
