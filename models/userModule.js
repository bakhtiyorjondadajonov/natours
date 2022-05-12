const mongoose = require('mongoose');
const validator1 = require('mongoose-validator');
const validator2 = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 25,
  },
  photo: {
    type: String,
  },
  email: {
    type: String,
    require: [true, 'User must have an e-mail address'],
    unique: true,
    lowercase: true,
    validate: [validator2.isEmail, 'Please provide a valid e-mail address'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
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
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 2000;
  next();
});
//Encoding the password
userSchema.pre('save', async function (next) {
  //Only run this function if password was not modified
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
// CHECKING WHEATHER THE USER CHANGED THE PASSWORD AFTER THE TOKEN ISSUED
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedPasswordAtStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedPasswordAtStamp;
  } else return false; // this means user has not changed the password yet
};

//RESETING THE TOKEN IF USER FOROT THE PASSWORD | THIS IS AN INSTANCE METHOD

userSchema.methods.createPasswordResetToken = function () {
  //we need build in crypto module to create a simple token
  const resetToken = crypto.randomBytes(32).toString('hex');

  //encrypt your reset token in order to save to the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
