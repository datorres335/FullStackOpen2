const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// No catch block needed – Express 5 handles errors in async handlers
// if you're using Express 5.x, you can safely remove explicit try/catch blocks in your async route handlers, as long as you have a proper error-handling middleware in place.
// we don't need the next parameter in the route handlers or use the next function to pass errors to the error-handling middleware either

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('userId', { username: 1, name: 1 }) // populate the userId field with the username and name of the user
  
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = await User.findById(request.body.userId) // NOTE: THIS CODE MIGHT BE WRONG???????????
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    userId: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  if (savedBlog) {
    response.status(201).json(savedBlog) // 201 Created status code indicates that the request has been fulfilled and a new resource has been created and returned
  } else {
    response.status(400).json({ error: 'Blog could not be created' }) // 400 Bad Request status code indicates that the server could not understand the request due to invalid syntax
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end() // 404 Not Found status code indicates that the requested resource could not be found on the server
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id)
  if (result) {
    response.status(204).end() // 204 No Content status code indicates that the request was successful but there is no content to return
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true, context: 'query' }) // new: true returns the updated document, 
    // runValidators: true ensures that the update respects the schema validation rules
    // context: 'query' is used to ensure that the validation context is set correctly for the update operation
  if (updatedBlog) {
    response.status(200).json(updatedBlog) // 200 OK status code indicates that the request has succeeded and the server is returning the updated resource
  } else {
    response.status(404).end() // 404 Not Found status code indicates that the requested resource could not be found on the server
  }
})

module.exports = blogsRouter
