const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User, Blog } = require('../models')

usersRouter.post('/', async (request, response) => {  
  const { username, name, password } = request.body

  if (!username || !password) {
    return response.status(400).json({
      error: 'username and password are required' 
    })
  }

  if ( username.length < 3 || password.length < 3 ) {
    return response.status(400).json({  // 400 Bad Request status code indicates that the server cannot or will not process the request due to a client error
      error: 'username and password must be at least 3 characters long' 
    })
  }
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({
    username,
    name,
    passwordHash,
  })

  response.status(201).json(user)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        as: 'blogs',
        attributes: ['title', 'author', 'url']
      }
    ]
  })
    
  response.json(users)
})
   
module.exports = usersRouter