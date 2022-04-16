const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();
app.use(express.json()); //MODDLEWARE
app.use(express.static(`${__dirname}/public`));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `Cannot find ${req.originalUrl} on this server!`,
  //   });
  const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  err.status = 'fail';
  next(err);
});
// ERRROR HANDLING MIDDLEWARE | we use this middleware to handle errors on central middleware,I mean on this middleware

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
module.exports = app;
