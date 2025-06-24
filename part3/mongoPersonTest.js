// this is a test file to connect to MongoDB and save a person to the database
// must run code with `node mongo.js <user_password_from_Atlas_MongoDB> <optional_person_name> <optional_person_number>`

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3] || 'No Name' // default name if not provided
const personNumber = process.argv[4] || 'No Number' // default number if not provided

const url = `mongodb+srv://datorres335:${password}@cluster0.uiaciun.mongodb.net/phonebookApp2?retryWrites=true&w=majority&appName=Cluster0`
// you can specify the database name in the URL, e.g. `const url = `mongodb+srv://datorres335:${password}@cluster0.uiaciun.mongodb.net/DATABASE_NAME_HERE?retryWrites=true&w=majority&appName=Cluster0`
// default database name is `test` if not specified

mongoose.set('strictQuery',false)

mongoose.connect(url)

//no need to define the id field in the schema, mongoose will automatically add it as a unique identifier for each document
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: personName,
  number: personNumber,
})
person.save().then(result => {
  console.log(`added ${result.name} number ${result.number} to phonebook`)
  //mongoose.connection.close()
})

Person.find({}).then(result => { // since the parameter is an empty object {}, it will return all documents in the collection
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})