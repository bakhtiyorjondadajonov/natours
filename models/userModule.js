const mongoose = require('mongoose');
const validator1 = require('mongoose-validator');
const validator2 = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 12,
  },
  email: {
    type: String,
    require: [true, 'User must have an e-mail address'],
    unique: true,
    lowercase: true,
    validate: [validator2.isEmail, 'Please provide a valid e-mail address'],
  },
  password: {
    type: 'String',
    required: [true, 'User must have a password '],
    minLength: 8,
  },
  // this only WORKS on SAVE AND CREATE
  passwordConfirm: {
    type: 'String',
    required: [true, 'User must confirm the pasword'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
});
//Encoding the password
userSchema.pre('save', async function (next) {
  //Only run this function if password was modified
  if (!this.isModified('password')) {
    return next();
  }
  //Hash the password cos of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;
