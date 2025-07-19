const { ApolloServer } = require('@apollo/server')
//const { startStandaloneServer } = require('@apollo/server/standalone')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
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

const start = async () => {
  const app = express()

  // Apply middleware GLOBALLY to the app, not to the route
  app.use(cors())
  app.use(express.json())

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

  // Remove cors() and express.json() from here
  app.use(
    '/',
    // cors(),
    // express.json(),
    expressMiddleware(server, {
      context: async () => {
        return {} // Simple context for testing
      }
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () => console.log(`Server is now running on http://localhost:${PORT}`))
}
start()