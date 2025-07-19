const { ApolloServer } = require('@apollo/server')
//const { startStandaloneServer } = require('@apollo/server/standalone')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
//const { useServer } = require('graphql-ws/lib/use/ws')
const { makeServer } = require('graphql-ws')
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

  // Add debugging middleware
  app.use((req, res, next) => {
    console.log('Request body:', req.body)
    console.log('Content-Type:', req.headers['content-type'])
    next()
  })

  app.use(cors())
  app.use(express.json())

  // Add another debug to confirm json middleware ran
  app.use((req, res, next) => {
    console.log('After express.json(), req.body:', req.body)
    next()
  })

  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = makeServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              // await serverCleanup.dispose()
              
              // For makeServer, you don't need .dispose()
              wsServer.close()              
            }
          }
        }
      }
    ],
  })

  await server.start()

  app.use(
    '/',
    // cors(),
    // express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        console.log('Context function - req.body:', req.body) // Debug
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id)//.populate('favoriteGenre')
          return { currentUser }
        }
      }
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () => console.log(`Server is now running on http://localhost:${PORT}`))
}
start()

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// })

// startStandaloneServer(server, {
//   listen: { port: 4000 },
//   context: async ({req, res}) => {
//     const auth = req ? req.headers.authorization : null
//     if (auth && auth.startsWith('Bearer ')) {
//       const decodedToken = jwt.verify(
//         auth.substring(7), // remove 'Bearer ' prefix
//         process.env.JWT_SECRET
//       )
//       const currentUser = await User.findById(decodedToken.id)
//       return { currentUser }
//     }
//   }
// }).then(({ url }) => {
//   console.log(`Server ready at ${url}`)
// })