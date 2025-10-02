const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true // removes extra whitespaces
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'], // NOTE: do we want to add or remove any roles?
    default: 'student'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] // checks for valid email structure being entered
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }, 
  projects: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
