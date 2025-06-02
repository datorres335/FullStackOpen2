require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI //delete this line when you figuire out exactly how to use MONGODB_URI in your tests

module.exports = { TEST_MONGODB_URI, MONGODB_URI, PORT }