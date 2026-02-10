const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20
  },
  surname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20
  },
  username: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 5
  }
});

module.exports = mongoose.model('User', userSchema);
