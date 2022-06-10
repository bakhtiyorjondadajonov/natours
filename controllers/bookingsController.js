/* eslint-disable no-unused-vars */
const stripe = require('stripe')(
  'sk_test_51L7BSQAAxAOnpsobTqiq8VKaPieoR3NLXrsgI1I8BYKB12ykBnb9On51PSuEYC6K3JQKxi3IvMFBuIt6bXBoS3j900k6vRcdCz'
);
const catchAsync = require('../utilities/catchAsync');
// const AppError = require('../utilities/appError');
const factory = require('./handleFactory');
const Tour = require('../models/tourModel');
const Bookings = require('../models/bookingsModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get currently booked Tour
  const tour = await Tour.findById(req.params.tourID);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    //information about the session itself
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.name
      .toLowerCase()
      .split(' ')
      .join('-')}`,
    customer_email: req.user.email,
    line_items: [
      //information about the product user purchases
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  //3) Create session as response

  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only temporary,As it is unsecure:everone can make bookings without paying
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();
  const newBooking = await Bookings.create({
    tour,
    user,
    price,
  });
  res.redirect(req.originalUrl.split('?')[0]);
});
exports.createBookings = factory.createOne(Bookings);
exports.getBookings = factory.getAll(Bookings);
exports.getOneBooking = factory.getOne(Bookings);
exports.deleteBookings = factory.deleteOne(Bookings);
exports.updateBookings = factory.updateOne(Bookings);
