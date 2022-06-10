/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable prettier/prettier */
// const req = require('express/lib/request');
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
const HandleJsonWebTokenError = () => {
  const message = 'Invalid web token,Please log in again';
  return new AppError(message, 401);
};
const HandleJsonWebTokenExpired = () =>
  new AppError('Your token expired,please Log in again!', 401);

const sendErrorToDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // RENDERED WEB SITE
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong.',
      message: err.message,
    });
  }
};
const sendErrorToProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    //Operational.truested error:send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      //Programming or other unknown error:don't leak error details
    } else {
      console.error('Error💥💥', err);
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  } else {
    if (err.isOperational) {
      // RENDERED WEB SITE
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        message: err.message,
      });
    } else {
      return res.status(500).render('error', {
        title: 'Something went very wrong!',
        message: ' Please,Try again later',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorToDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (err.name === 'CastError') error = handleCastError(err);
    if (err.name === 'JsonWebTokenError') error = HandleJsonWebTokenError(err);
    if (err.name === 'TokenExpiredError')
      error = HandleJsonWebTokenExpired(err);
    if (err.code === 11000) error = handleDublicateFieldsDB(err);
    sendErrorToProd(error, req, res);
  }
};
