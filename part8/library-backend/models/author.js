const mongoose = require('mongoose')

//const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number,
  },
})

//schema.plugin(uniqueValidator)
schema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Author name must be unique'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Author', schema)