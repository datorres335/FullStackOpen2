const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: //String,
  {
    type: String,
    required: true,
    unique: true, // this ensures that the username is unique across all users
      //we want to be careful when using the uniqueness index. If there are already documents in the database that violate the uniqueness condition, no index will be created.
    minlength: 3
  },
  name: String,
  passwordHash: String,
  blogs: [
    { // this block of code is defining what each blog in the blogs array should be
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog' // this creates a reference to the Blog model
    }
  ]
})

// The toJSON method is used to customize the JSON representation of the document when it is converted to JSON format. 
// It allows us to modify the output of the document when it is sent as a response to a client request.
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash // the passwordHash should not be revealed
  }
})

const User = mongoose.model('User', userSchema) // this will also automatically create a collection named 'users' in the database once the app is started
module.exports = User