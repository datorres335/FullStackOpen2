// this code below makes our app into a web server

require('dotenv').config() // this loads environment variables from a .env file into process.env
const express = require('express') // same syntax as "import express from 'express'"
const app = express() // this creates an Express application. The app variable is now an instance of the Express application, which can be used to define routes and middleware.

//const cors = require('cors') // this is a middleware that enables Cross-Origin Resource Sharing (CORS) in the Express application. CORS is a security feature implemented by web browsers to restrict web pages from making requests to a different domain than the one that served the web page. The cors() middleware allows the server to accept requests from different origins, which is useful when the frontend and backend are hosted on different domains or ports.
//app.use(cors()) // can remove cors if you are using a proxy in your frontend development server configuration (in vite.config.js) to forward requests to the backend server. Refer to vite.config.js for the proxy setup.

app.use(express.json()) // this middleware parses (converts) incoming requests with JSON payloads. It is used to parse the JSON data in the request body and make it available as a javascript object in req.body. This is useful for handling POST requests where the client sends JSON data to the server.
// The express.json() middleware is built into Express and is used to parse JSON data in incoming requests. It is equivalent to the body-parser middleware that was commonly used in older versions of Express.

//const morgan = require('morgan') // this is a middleware for logging HTTP requests. It provides a simple way to log incoming requests and their details, such as the request method, URL, status code, and response time.
//app.use(morgan('tiny')) // this is a built-in middleware function in Express that logs HTTP requests in a concise format. The 'tiny' format includes the HTTP method, URL, status code, and response time. This middleware is useful for debugging and monitoring incoming requests to the server.
const morgan = require('morgan')
// Custom token to log request body
morgan.token('body', (req) => JSON.stringify(req.body))
// Use morgan with custom format to include request body for POST requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist')) // this middleware serves static files from the 'dist' directory (built from the frontend repo). It allows the server to serve static assets such as HTML, CSS, JavaScript, and images directly from the specified directory. When a request is made for a file that exists in the 'dist' directory, Express will serve that file directly without needing to define a specific route for it.

const Person = require('./models/person')

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/info', (request, response) => {
  const date = new Date()
  Person.countDocuments({}).then(count => {
    const info = `
      <div>
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      </div>
    `
    response.send(info)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons) // this will return all persons in the database as a JSON array
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else { // this else block gets executed if the given id is of a valid format but is not found in the database
        response.status(404).end() // 404 means not found
      }
    })
    .catch(error => { // this else block gets executed if the given id is NOT of a valid format
      next(error) // this will pass the error to the error handling middleware
        // next(error) is a function provided by Express that allows you to pass an error to the next middleware in the stack.
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end() // 204 means no content
      // The server successfully processed the request, but is not returning any content.
      // 204 is typically used for DELETE requests, where the server doesn't need to return any data after deleting a resource.
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'Name or Number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error)) // an error is thrown if the validation rules defined in the personSchema are not met
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }
      
      person.name = body.name
      person.number = body.number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`) //this only prints on the VScode terminal and not on the browser
})

// Unknown endpoint middleware should be after all routes
const unkownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unkownEndpoint) // this middleware handles requests to unknown endpoints. If a request is made to an endpoint that is not defined in the application, this middleware will send a 404 status code and a JSON response with an error message.
// The app.use() method is used to mount middleware functions at a specific path. In this case, the unkownEndpoint function is mounted as middleware for all requests that do not match any defined routes.

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') { // this error is thrown if the validation rules defined in the personSchema are not met
    return response.status(400).json({error: error.message})
  }

  next(error) // this will pass the error to the default error handler provided by Express, which will send a generic error response to the client.
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)