const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {  
  const { username, name, password } = request.body
  console.log('User data received:', request.body)
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })
  console.log('Creating new user:', user)

  const savedUser = await user.save()

  console.log('User saved:', savedUser)
  
  response.status(201).json(savedUser)
})
   
module.exports = usersRouter