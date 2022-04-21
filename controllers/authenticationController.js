const User = require('./../models/userModule');
const jwt = require('jsonwebtoken');
// -------- CATCHING ERRORS IN ASYNC FUNCTIONS ---------- //
const catchAsync = require('./../utilities/catchAsync');
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = jwt.sign({ id: newUser._id }, process.env.SECRET_JWT, {
    expiresIn: process.env.EXP_DATE,
  });
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
