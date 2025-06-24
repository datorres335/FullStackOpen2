// this is a test file to connect to MongoDB and save a person to the database
// must run code with `node mongo.js <user_password_from_Atlas_MongoDB> <optional_person_name> <optional_person_number>`

const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

const blogTitle = process.argv[2] || 'No Title' 
const blogAuthor = process.argv[3] || 'No Author'
const blogUrl = process.argv[4] || 'No URL'
const blogLikes = process.argv[5] || 0 

const url = require('./utils/config').TEST_MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)

//no need to define the id field in the schema, mongoose will automatically add it as a unique identifier for each document
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: blogTitle,
  author: blogAuthor,
  url: blogUrl,
  likes: blogLikes,
})
blog.save().then(result => {
  console.log(`added ${result.title} by ${result.author} to test blog list`)
  //mongoose.connection.close()
})

Blog.find({}).then(result => { // since the parameter is an empty object {}, it will return all documents in the collection
  result.forEach(blog => {
    console.log(blog)
  })
  mongoose.connection.close()
})