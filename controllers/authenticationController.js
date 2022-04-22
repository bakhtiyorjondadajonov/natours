const User = require('./../models/userModule');
const jwt = require('jsonwebtoken');
const AppError = require('./../utilities/appError');
// -------- CATCHING ERRORS IN ASYNC FUNCTIONS ---------- //
const catchAsync = require('./../utilities/catchAsync');
const signInToken = function (id) {
  return jwt.sign({ id }, process.env.SECRET_JWT, {
    expiresIn: process.env.EXP_DATE,
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signInToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password excists
  if (!email || !password) {
    return next(new AppError('Please,Enter password and email!!!', 400));
  }
  //check if user excists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect password or email!', 401));
  }
  const token = signInToken(user._id);
  //if everything is ok,send token to the client

  res.status(200).json({
    status: 'success',
    token,
  });
});
