const User = require('./../models/userModule');
const jwt = require('jsonwebtoken');
const Email = require('../utilities/email');
const crypto = require('crypto');
const AppError = require('./../utilities/appError');
// const sendEmail = require('./../utilities/email');
// -------- CATCHING ERRORS IN ASYNC FUNCTIONS ---------- //
const catchAsync = require('./../utilities/catchAsync');
const signInToken = function (id) {
  return jwt.sign({ id }, process.env.SECRET_JWT, {
    expiresIn: process.env.EXP_DATE,
  });
};
//---CREATE AND SAVE TOKEN FN------//
const createAndSaveToken = (user, statusCode, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXP_DATE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  const token = signInToken(user._id);
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();
  createAndSaveToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password excists
  if (!email || !password) {
    return next(new AppError('Please,Enter password and email!!!', 400));
  }
  //check if user excists && password is correct
  const user = await User.findOne({ email }).select(
    '+password name role photo'
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect password or email!', 401));
  }

  //if everything is ok,send token to the client
  createAndSaveToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expiresIn: Date.now() + 10000,
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and checking if its there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) token = req.cookies.jwt;
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

// Only for rendered pages,no errors!
exports.isLoggedIn = async (req, res, next) => {
  // 1) Getting token and checking if its there
  let token;
  if (req.cookies.jwt) token = req.cookies.jwt;
  try {
    if (!token) {
      return next();
    }
    // 2) Verification token
    const payload = jwt.verify(token, process.env.SECRET_JWT);

    // 3) Check if user still excists
    const currentUser = await User.findById(payload.id);
    if (!currentUser) {
      return next();
    }

    // 4) Check if user changed password after the JWT was issued
    if (currentUser.changedPasswordAfter(payload.iat)) {
      return next();
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    res.locals.user = currentUser; // eache and every pug template has got an access to res.locals
    // TERE IS A logged in USER
    req.user = currentUser;
    next();
  } catch (error) {
    next();
  }
};

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get user based on POSTed email

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('There is not any user with this email address', 404)
    );
  }
  // 2) Generate the random reset token

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send the token to user's email

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email.Please check your inbox or spam',
    });
  } catch (error) {
    console.log('error: ', error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ valideateBeforeSave: false });
    return next(
      new AppError(
        `There was an error sending the email. Try again later!`,
        500
      )
    );
  }
});

exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on the token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired,and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt properity for the user | I did it in userModules.js file
  const token = signInToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
  });
};

exports.updatePassword = async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select('+password');
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your password is NOT correct!', 401));
  }
  // 3) If SourceBuffer, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4) Log user in, send JWT
  createAndSaveToken(user, 200, res);
};
