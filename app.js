/* eslint-disable no-unused-vars */
const compression = require('compression');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp'); // | http parametr pollution
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config.env' });
const helmet = require('helmet'); //  | THIS IS A KIND OF STANDART TO USE THIS PACKAGE  WHO IS BUILDING AN EXPRESS APP
const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/userRoutes');
const reviewsRouter = require('./routes/reviewsRoute');
const bookingsRouter = require('./routes/bookingsRoutes');
const viewsRouter = require('./routes/viewsRoutes');
//---------Error handlers
const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
//---------------------------//
const app = express();
//------setting views part ----- creating pug environment
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, `views`));
//---------- SERVING STATIC FILES -------------//
app.use(express.static(path.join(__dirname, `public`)));
// ----------------SETTING SECURITY HTTP HEADERS-----------//
// app.use(helmet.ContentSecurityPolicy());
// ----------------LIMIT REQUESTS FROM THE SAME API OR IP ADDRESS-----------//
const limiter = rateLimit({
  max: 100,
  windowMilliSec: 60 * 60 * 1000, // | Tile limit in milliseconds
  message: 'Too many requests,Please try again in an hour!',
});

app.use('/api', limiter);
//---------- BODY PARSER,READING DATA FROM BODY INTO REQ.BODY -------------//
app.use(express.json()); //MODDLEWARE
app.use(
  express.urlencoded({
    extended: true,
  })
);
//---------- COOKIE PARSER,READING DATA FROM COOKIE   -------------//
app.use(cookieParser());
app.use((req, res, next) => {
  next();
});
//---------- DATA SANITIZATION | we had better do this action after body parsing,because first the program reads the data then sanitizes against NoSQL query injection -------------//
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'difficulty',
      'maxGroupSize',
      'ratingsAverage',
      'ratingsQuantity',
    ],
  })
);
app.use(compression());
//ROUTES
//---------VIEWS ROUTE--------
app.use('/', viewsRouter);

//---------OTHER ROUTES-------
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/bookings', bookingsRouter);
//Implementing a Global Error Handling Middleware
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});
// ERRROR HANDLING MIDDLEWARE | we use this middleware to handle errors on central middleware,I mean on this middleware

app.use(globalErrorHandler);
module.exports = app;
