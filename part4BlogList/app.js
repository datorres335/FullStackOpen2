//require('express-async-errors') UNABLE TO USE THIS LIBRARY AS IT IS NOT COMPATIBLE WITH EXPRESS 5.X
  // You do NOT need express-async-errors because Express 5 has native support for async/await error handling.
  // if you're using Express 5.x, you can safely remove explicit try/catch blocks in your async route handlers, as long as you have a proper error-handling middleware in place.
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const app = express()

logger.info('connecting to MongoDB')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app