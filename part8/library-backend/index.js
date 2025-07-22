const { ApolloServer } = require('@apollo/server')
//const { startStandaloneServer } = require('@apollo/server/standalone')
const { expressMiddleware } = require('@apollo/server/express4') // FIXED APOLLO SERVER EXPRESS BUG. Had to downgrade to express4 from express5
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws') //had to downgrade from graphql-ws@v6 to v5 as v6 did not have useServer function
//const { v4: uuid } = require('uuid')
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false) // to avoid deprecation warning
const MONGODB_URI = process.env.MONGODB_URI
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const resolvers = require('./resolvers')
const typeDefs = require('./schema')

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('error connection to MongoDB: ', error.message);
  })

mongoose.set('debug', true) // Enable mongoose debug mode to log all queries

const start = async () => {
  const app = express()

  // Apply middleware GLOBALLY to the app, not to the route
  // app.use(cors())
  // app.use(express.json())

  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        try {
          const auth = req ? req.headers.authorization : null
          if (auth && auth.startsWith('Bearer ')) {
            const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
            // Completely remove .populate() - it's causing issues
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
          }
          return {} // Return empty context if no auth
        } catch (error) {
          console.error('Context error:', error)
          return {} // Return empty context on error
        }
      }
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () => console.log(`Server is now running on http://localhost:${PORT}`))
}
start()