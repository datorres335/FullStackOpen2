//NOTE: you don't need to have the backend server running to run this test file, it will connect to the database directly

const { test, after, beforeEach, describe } = require('node:test') // What does "after" do? It runs after all tests in the file have completed
  // What does "beforeEach" do? It runs before each test in the file, allowing you to set up the environment for each test
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app) // supertest is a library that allows you to test HTTP servers by making requests and checking responses
  // app becomes a "superagent" object
  // supertest allows you to test your HTTP requests without having to worry about ports
const Blog = require('../models/blog')
const helper = require('./test_helper')
const { url } = require('node:inspector')

describe('When there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({}) // delete all blogs in the database before each test
    await Blog.insertMany(helper.initialBlogs) // insert initial blogs into the database before each test
  })

  // using test.only will run only this test and skip all other tests in the file
  test('blogs are returned as json', async () => { // why use async here? Because we are using "await" inside the function, which is an asynchronous operation
      // what does "async" do? It allows us to use "await" inside the function, which makes the function return a promise
      // what does await do? It pauses the execution of the function until the promise is resolved, allowing us to write asynchronous code in a synchronous style
    await api
      .get('/api/blogs')
      .expect(200) // test will fail if the response status code is not 200
        // what does 200 mean? It means that the request was successful and the server returned the requested resource
      .expect('Content-Type', /application\/json/) // The desired value is now defined as regular expression or in short regex. 
        // The regex starts and ends with a slash /, and because the desired string application/json also contains the same slash, 
        // it is preceded by a \ so that it is not interpreted as a regex termination character.
        // its best to use regex here over a string because the content type can have additional parameters like charset=utf-8
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    // execution gets here only after the HTTP request is complete
    // the result of HTTP request is saved in variable response
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map(e => e.title)

    assert.strictEqual(title.includes('TestTitle'), true)
  })

  test('blog without title or url is not added', async () => {
    const noTitleBlog = {
      title: '',
      author: 'Blog without Title',
      url: 'http://blogwithouttitle.com',
      likes: 5
    }
    await api
      .post('/api/blogs')
      .send(noTitleBlog)
      .expect(400) //status code 400 means that the request was invalid
        // does anything get returned with 400? Yes, the response body will contain an error message indicating what went wrong

    const noUrlBlog = {
      title: 'Blog without URL',
      author: 'Author of Blog without URL',
      url: '',
      likes: 3
    }
    await api
      .post('/api/blogs')
      .send(noUrlBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]
      
      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200) // status code 200 means that the request was successful
        .expect('Content-Type', /application\/json/)
      
      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonExistingId = await helper.nonExistingId()
      await api
        .get(`/api/blogs/${validNonExistingId}`)
        .expect(404) // status code 404 means that the requested resource was not found
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400) // status code 400 means that the request was invalid
          // is status code 400 a default value when the request is invalid? Yes, it indicates that the server cannot process the request due to a client error
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'New Test Blog',
        author: 'New Test Author',
        url: 'http://newtesturl.com',
        likes: 15
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201) // what does 201 mean? It means that the request was successful and a new resource was created
        .expect('Content-Type', /application\/json/) // what does this do? It checks that the response is in JSON format

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('New Test Blog')) //this checks that the new blog is in the response by checking if the title is included in the array of titles
        // The plain assert() function just checks if the given expression is truthy
    })

    test('fails with status code 400 if data is invalid', async () => {
      const invalidBlog = {
        title: 'Invalid Blog',
        url: 'http://invalidblog.com',
      }

      await api
        .post('/api/blogs')
        .send(invalidBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('default likes are set to 0 if not provided', async () => {
      const newBlog = {
        title: 'Blog without Likes!!!',
        author: 'Author of Blog without Likes',
        url: 'http://blogwithoutlikes.com'
      }
      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201) // status code 201 means that the request was successful and a new resource was created and the response contains the created resource
        .expect('Content-Type', /application\/json/)
      
      assert.strictEqual(response.body.likes, 0)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204) // status code 204 means that the request was successful and there is no content to return

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(n => {n.title})

      assert(!titles.includes(blogToDelete.title))
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })
})

after(async () => {
  try {
    await mongoose.connection.close()
    await mongoose.disconnect()
  } catch (error) {
    console.error('Error closing mongoose connection:', error)
  }
})
