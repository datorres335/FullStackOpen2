const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  // name: String,
  // number: String,
  name: { //the stuff inside the braces are the validation rules before saving the data to the database
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d+/.test(v) // this regex checks if the number is in the format of 2 or 3 digits followed by a hyphen and then one or more digits
      },
      message: props => `${props.value} is not a valide phone number!`
    }
  }
})

personSchema.set('toJSON', { // this method is used to customize the JSON representation of the document when it is converted to JSON format. It allows us to modify the output of the document when it is sent as a response to a client request.
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id // don't need _id in the JSON response, as it is not a user-friendly identifier. Instead, we create a new id field that is a string representation of the _id object.
    delete returnedObject.__v // __v is a version key that Mongoose adds to each document. It's used internally by Mongoose to track changes to the document.
  }
})

module.exports = mongoose.model('Person', personSchema)