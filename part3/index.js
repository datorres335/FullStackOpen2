// this code below makes our app into a web server

//NODE CODE BELOW
//const http = require('http') // node's built-in web server module. Same syntax as "import http from 'http'"
const express = require('express') // same syntax as "import express from 'express'"
const app = express() // this creates an Express application. The app variable is now an instance of the Express application, which can be used to define routes and middleware.

const cors = require('cors') // this is a middleware that enables Cross-Origin Resource Sharing (CORS) in the Express application. CORS is a security feature implemented by web browsers to restrict web pages from making requests to a different domain than the one that served the web page. The cors() middleware allows the server to accept requests from different origins, which is useful when the frontend and backend are hosted on different domains or ports.
app.use(cors())

app.use(express.json()) // this middleware parses (converts) incoming requests with JSON payloads. It is used to parse the JSON data in the request body and make it available as a javascript object in req.body. This is useful for handling POST requests where the client sends JSON data to the server.
// The express.json() middleware is built into Express and is used to parse JSON data in incoming requests. It is equivalent to the body-parser middleware that was commonly used in older versions of Express.

//const morgan = require('morgan') // this is a middleware for logging HTTP requests. It provides a simple way to log incoming requests and their details, such as the request method, URL, status code, and response time.
//app.use(morgan('tiny')) // this is a built-in middleware function in Express that logs HTTP requests in a concise format. The 'tiny' format includes the HTTP method, URL, status code, and response time. This middleware is useful for debugging and monitoring incoming requests to the server.
const morgan = require('morgan')
// Custom token to log request body
morgan.token('body', (req) => JSON.stringify(req.body))
// Use morgan with custom format to include request body for POST requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//NODE CODE BELOW
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' }) //The application/json value in the Content-Type header informs the receiver that the data is in the JSON format.
//   response.end(JSON.stringify(notes)) // this is the response that will be sent to the browser. The notes array gets transformed into JSON formatted string with the JSON.stringify method. This is necessary because the response.end() method expects a string or a buffer to send as the response body.
// })

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1')
})

app.get('/info', (request, response) => {
  const date = new Date()
  const info = `
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    </div>
  `
  response.send(info)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  // console.log(request.params) // this will log the parameters in the URL;
  // console.log(request); // this will log the entire request object;
  
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end() // 404 means not found
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end() // 204 means no content
  // The server successfully processed the request, but is not returning any content.
  // This is typically used for DELETE requests, where the server doesn't need to return any data after deleting a resource.
})

const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000000000)

  return String(randomId)

  // const maxId = persons.length > 0
  //   ? Math.max(...persons.map(n => Number(n.id)))
  //   : 0
  // return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'Name or Number is missing'
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name, 
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`) //this only prints on the VScode terminal and not on the browser
})

// Unknown endpoint middleware should be after all routes
const unkownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unkownEndpoint) // this middleware handles requests to unknown endpoints. If a request is made to an endpoint that is not defined in the application, this middleware will send a 404 status code and a JSON response with an error message.
// The app.use() method is used to mount middleware functions at a specific path. In this case, the unkownEndpoint function is mounted as middleware for all requests that do not match any defined routes.
