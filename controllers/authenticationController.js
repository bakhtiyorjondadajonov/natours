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
    passwordChangedAt: req.body.passwordChangedAt,
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
exports.protect = catchAsync(async (req, res, next) => {
  console.log('Bismillah');
  // 1) Getting token and checking if its there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in,Please log in to get access', 401)
    );
  }
  // 2) Verification token
  const payload = jwt.verify(token, process.env.SECRET_JWT);

  // 3) Check if user still excists
  const currentUser = await User.findById(payload.id);
  if (!currentUser) {
    return next(
      new AppError('The User that belongs this token does not exist!', 401)
    );
  }

  // 4) Check if user changed password after the JWT was issued
  if (currentUser.changedPasswordAfter(payload.iat)) {
    return next(
      new AppError(
        'You have changed the password recently,Please log in again.',
        401
      )
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have a permission for this action.', 403)
      );
    }
    return next();
  };
};
