//require('express-async-errors') UNABLE TO USE THIS LIBRARY AS IT IS NOT COMPATIBLE WITH EXPRESS 5.X
  // You do NOT need express-async-errors because Express 5 has native support for async/await error handling.
  // if you're using Express 5.x, you can safely remove explicit try/catch blocks in your async route handlers, as long as you have a proper error-handling middleware in place.
const express = require('express')
const { sequelize } = require('./models')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const app = express()

logger.info('connecting to PostgreSQL database')

sequelize
  .authenticate()
  .then(async () => {
    logger.info('connected to PostgreSQL database')
    // Sync database tables
    await sequelize.sync({ alter: true })
    logger.info('Database tables synchronized')
  })
  .catch((error) => {
    logger.error('error connecting to PostgreSQL database:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
// app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') { // ensures testing routes are only available in test environment
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

app.use(express.static('dist'))
app.use(express.json())
// app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') { // ensures testing routes are only available in test environment
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

app.use(express.static('dist'))
app.use(express.json())
// app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') { // ensures testing routes are only available in test environment
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app