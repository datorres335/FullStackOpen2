const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true, // 400 Bad Request is returned if any required field is missing
    minlength: 1
  },
  author: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    minlength: 5
  },
  likes: {
    type: Number,
    default: 0
  },
  userId: { // CHANGED THE FIELD NAME FROM user TO userId
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// The toJSON method is used to customize the JSON representation of the document when it is converted to JSON format. 
// It allows us to modify the output of the document when it is sent as a response to a client request.
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema) // this will also automatically create a collection named 'blogs' in the database once the app is started