const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  
  if (!(user && passwordCorrect)) {
    return response.status(401).json({ // 401 Unauthorized status code indicates that the request has not been applied because it lacks valid authentication credentials for the target resource
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign( // once you run the login.rest file, you will see the token 'Bearer' in the response body.
    userForToken, 
    process.env.SECRET,
    //{ expiresIn: 60 * 60 } // token will expire in 1 hour, this will force the user to login again, useful for security purposes
    // a better way achieve token security is to implement server-side session
    // its quite common to save the session corresponding to a token to a key-value database such as Redis
  ) 
  response
    .status(200) // 200 OK status code indicates that the request has succeeded
    .send({ token, username: user.username, name: user.name, id: user._id }) //CHANGED THIS LINE TO INCLUDE ID!!! HAVE NOT TESTED BACKEND
    //.send({ token, username: user.username, name: user.name }) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
})

module.exports = loginRouter