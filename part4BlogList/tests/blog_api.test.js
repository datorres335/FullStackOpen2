//NOTE: you don't need to have the backend server running to run this test file, it will connect to the database directly

const { test, after } = require('node:test') // What does "after" do? It runs after all tests in the file have completed
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app) // supertest is a library that allows you to test HTTP servers by making requests and checking responses
  // app becomes a "superagent" object
  // supertest allows you to test your HTTP requests without having to worry about ports

test('blogs are returned as json', async () => { // why use async here? Because we are using "await" inside the function, which is an asynchronous operation
    // what does "async" do? It allows us to use "await" inside the function, which makes the function return a promise
    // what does await do? It pauses the execution of the function until the promise is resolved, allowing us to write asynchronous code in a synchronous style
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/) // The desired value is now defined as regular expression or in short regex. 
      // The regex starts and ends with a slash /, and because the desired string application/json also contains the same slash, 
      // it is preceded by a \ so that it is not interpreted as a regex termination character.
      // its best to use regex here over a string because the content type can have additional parameters like charset=utf-8
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  // execution gets here only after the HTTP request is complete
  // the result of HTTP request is saved in variable response
  assert.strictEqual(response.body.length, 2)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const title = response.body.map(e => e.title)

  assert.strictEqual(title.includes('TestTitle'), true)
})

after(async () => {
  await mongoose.connection.close() // we must close the connection to the database after all tests are done or else the test program will not terminate
})
