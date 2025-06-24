// event handlers of routes are commonly referred to as controllers
//its an almost exact copy of the code in the index.js file
//one difference the code we origially had in index.js is that paths in the route handlers were prefixed with /api/persons
/**
 So what are these router objects exactly? The Express manual provides the following explanation:
  A router object is an isolated instance of middleware and routes. 
  You can think of it as a “mini-application,” capable only of performing middleware and routing functions. 
  Every Express application has a built-in app router.
 */

const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/info', (request, response) => {
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

personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons) // this will return all persons in the database as a JSON array
  })
})

personsRouter.get('/:id', (request, response, next) => {
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

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end() // 204 means no content
      // The server successfully processed the request, but is not returning any content.
      // 204 is typically used for DELETE requests, where the server doesn't need to return any data after deleting a resource.
    })
    .catch(error => next(error))
})

personsRouter.post('/', (request, response, next) => {
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

personsRouter.put('/:id', (request, response, next) => {
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

module.exports = personsRouter