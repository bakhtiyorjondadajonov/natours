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
    select: false,
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
  passwordChangedAt: Date,
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
//Decoding the password
//CREATING AN INSTANCE METHOD:this is avaiable in all documents of certain collection,it is like prototype methods in OOP
userSchema.methods.correctPassword = async function (
  //you can change the name of the method (here,it is "correctPassword")
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedPasswordAtStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(
      'JWTTimestamp < changedPasswordAtStamp: ',
      JWTTimestamp < changedPasswordAtStamp
    );
    return JWTTimestamp < changedPasswordAtStamp;
  } else return false; // this means user has not changed the password yet
};
const User = mongoose.model('User', userSchema);
module.exports = User;
