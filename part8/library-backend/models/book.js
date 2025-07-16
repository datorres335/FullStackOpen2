const mongoose = require('mongoose')

// you must install this library "npm install mongoose-unique-validator@latest"?
//const uniqueValidator = require('mongoose-unique-validator') // UNINSTALLED THIS LIBRARY, WAS CAUSING PROBLEMS

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    { type: String}
  ]
})

//schema.plugin(uniqueValidator)
schema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Book title must be unique'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Book', schema)