const express = require('express');
const dotenv = require('dotenv');
//---------Error handlers
const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
//---------------------------//
dotenv.config({ path: './config.env' });
const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();
app.use(express.json()); //MODDLEWARE
app.use(express.static(`${__dirname}/public`));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//Implementing a Global Error Handling Middleware
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});
// ERRROR HANDLING MIDDLEWARE | we use this middleware to handle errors on central middleware,I mean on this middleware

app.use(globalErrorHandler);
module.exports = app;
