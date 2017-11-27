require('dotenv').config()
const fastify = require('fastify')()
const cors = require('cors')
const { getConnectUrl } = require('./utils/db')

const { SERVER_HOST, SERVER_PORT } = process.env

fastify.use(cors())

fastify.register(require('fastify-mongodb'), {
  url: getConnectUrl(),
})

/**
 * Checks if the server is up.
 */
fastify.get('/status', async (request, reply) => {
  reply.type('application/json').code(200)
  return true
})

fastify.register(require('./api/v1/auth/routes'), { prefix: '/v1' })
fastify.register(require('./api/v1/users/routes'), { prefix: '/v1' })
fastify.register(require('./api/v1/posts/routes'), { prefix: '/v1' })
fastify.register(require('./api/v1/favorites/routes'), { prefix: '/v1' })
fastify.register(require('./api/v1/moments/routes'), { prefix: '/v1' })

fastify.listen(SERVER_PORT, SERVER_HOST, err => {
  if (err) {
    throw err
  }

  console.log(
    `🖥 Server listening on ${fastify.server.address().address}:${
      fastify.server.address().port
    }...`
  )
})
