const mongoose = require('mongoose')
mongoose.set('strictQuery', false) // this is to avoid deprecation warnings in Mongoose 7.x

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
//const password = process.argv[2]
//const url = `mongodb+srv://datorres335:${password}@cluster0.uiaciun.mongodb.net/phonebookApp2?retryWrites=true&w=majority&appName=Cluster0`
const url = process.env.MONGODB_URI

console.log(`connecting to ${url}`)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  // name: String,
  // number: String,
  name: { //the stuff inside the braces are the validation rules before saving the data to the database
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
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