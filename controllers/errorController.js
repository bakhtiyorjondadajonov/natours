const AppError = require('../utilities/appError');

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDublicateFieldsDB = (err) => {
  const value = err.message.match(/"((?:\\.|[^"\\])*)"/)[0];
  const message = `Dublicate field value ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const HandleJsonWebTokenError = (err) => {
  const message = 'Invalid web token,Please log in again';
  return new AppError(message, 401);
};
const HandleJsonWebTokenExpired = () => {
  return new AppError('Your token expired,please Log in again!', 401);
};
const sendErrorToDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorToProd = (err, res) => {
  //Operational.truested error:send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programming or other unknown error:don't leak error details
  } else {
    console.error('Error💥💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorToDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (err.name === 'CastError') error = handleCastError(err);
    if (err.name === 'JsonWebTokenError') error = HandleJsonWebTokenError(err);
    if (err.name === 'TokenExpiredError')
      error = HandleJsonWebTokenExpired(err);
    if (err.code === 11000) error = handleDublicateFieldsDB(err);
    sendErrorToProd(error, res);
  }
};
