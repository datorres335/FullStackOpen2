// this file creates the actual Express application and sets up the routes using the router objects defined in controllers/persons.js

const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config') // contains environment variables like MONGODB_URI and PORT
const logger = require('./utils/logger') // contains logging functions for info and error messages
const middleware = require('./utils/middleware') // contains middleware functions for logging requests, handling unknown endpoints, and errors
const personsRouter = require('./controllers/persons') // this imports the personsRouter which contains the routes for handling person-related requests
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

app.use(express.static('dist')) // this serves the static files in the dist folder, which is where the React app is built to
app.use(express.json()) // this middleware parses the JSON body of incoming requests, allowing us to access the data in request.body
app.use(middleware.requestLogger)
app.use('/api/persons', personsRouter) // this mounts the personsRouter on the /api/persons path, so all routes defined in personsRouter will be prefixed with /api/persons 
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app