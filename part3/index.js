// this code below makes our app into a web server

//NODE CODE BELOW
//const http = require('http') // node's built-in web server module. Same syntax as "import http from 'http'"
const express = require('express') // same syntax as "import express from 'express'"
const app = express() // this creates an Express application. The app variable is now an instance of the Express application, which can be used to define routes and middleware.

app.use(express.json()) // this middleware parses (converts) incoming requests with JSON payloads. It is used to parse the JSON data in the request body and make it available as a javascript object in req.body. This is useful for handling POST requests where the client sends JSON data to the server.
// The express.json() middleware is built into Express and is used to parse JSON data in incoming requests. It is equivalent to the body-parser middleware that was commonly used in older versions of Express.

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
  console.log(request.params) // this will log the parameters in the URL;
  
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`) //this only prints on the VScode terminal and not on the browser
})
