// PLEASE NOTE, IT IS COMMON FOR TESTS TO FAIL THE MORE YOU CHANGE AND EXPAND YOUR APPLICATION

const { test, beforeEach, after, describe } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username: 'root', passwordHash})

    await user.save()
    //console.log('User created:', user)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Dave',
      name: 'Dave',
      password: 'secrettest'
    }

    //console.log('posting new user:', newUser)
    
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    //console.log('result.body:', result.body);

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with prorper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('invalid users are not created', () => {
  test('creation fails if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserShortName = {
      username: 'Da',
      name: 'Dave',
      password: 'secrettest'
    }

    await api
      .post('/api/users')
      .send(newUserShortName)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserShortPassword = {
      username: 'Dave',
      name: 'Dave',
      password: 'se'
    }

    await api
      .post('/api/users')
      .send(newUserShortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserMissingUsername = {
      name: 'Dave',
      password: 'secrettest'
    }

    await api
      .post('/api/users')
      .send(newUserMissingUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserMissingPassword = {
      username: 'Dave',
      name: 'Dave'
    }

    await api
      .post('/api/users')
      .send(newUserMissingPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
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