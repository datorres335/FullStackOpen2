const blogsRouter = require('express').Router()
const { Blog, User } = require('../models')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

// No catch block needed – Express 5 handles errors in async handlers
// if you're using Express 5.x, you can safely remove explicit try/catch blocks in your async route handlers, as long as you have a proper error-handling middleware in place.
// we don't need the next parameter in the route handlers or use the next function to pass errors to the error-handling middleware either

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['username', 'name']
      }
    ]
  })
  
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findByPk(decodedToken.id)
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = await Blog.create({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    userId: user.id
  })
  
  if (blog) {
    response.status(201).json(blog) // 201 Created status code indicates that the request has been fulfilled and a new resource has been created and returned
  } else {
    response.status(400).json({ error: 'Blog could not be created' }) // 400 Bad Request status code indicates that the server could not understand the request due to invalid syntax
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findByPk(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end() // 404 Not Found status code indicates that the requested resource could not be found on the server
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findByPk(decodedToken.id)
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = await Blog.findByPk(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.userId === user.id) {
    await blog.destroy()
    response.status(204).end() // 204 No Content status code indicates that the request was successful but there is no content to return
  } else {
    return response.status(403).json({ error: 'you do not have permission to delete this blog' }) // 403 Forbidden status code indicates that the server understands the request but refuses to authorize it
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findByPk(request.params.id)
  if (!blog) {
    return response.status(404).end() // 404 Not Found status code indicates that the requested resource could not be found on the server
  }

  const updatedBlog = await blog.update(request.body)
  response.status(200).json(updatedBlog) // 200 OK status code indicates that the request has succeeded and the server is returning the updated resource
})

module.exports = blogsRouter
