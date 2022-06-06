const Tour = require('../models/tourModel');
const { findByIdAndUpdate } = require('../models/userModule');
const User = require('../models/userModule');
const AppError = require('../utilities/appError');
const Bookings = require('../models/bookingsModel');
const catchAsync = require('./../utilities/catchAsync');
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get tour data from collection
  const tours = await Tour.find();
  // 2)Build the template

  // 3) Render that template using data from 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tourName = req.params.tourName
    .split('-')
    .map((el) => el[0].toUpperCase() + el.slice(1))
    .join(' ');

  const tour = await await Tour.findOne({ name: tourName }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is not tour with that name.', 404));
  }
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    user: req.user,
  });
});
exports.getLoginForm = catchAsync(async (req, res, next) => {
  console.log('Bismillah');
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});
exports.me = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your Account',
    user: req.user,
  });
});
exports.getMyTours = catchAsync(async (req, res, next) => {
  // find all bookings
  const bookings = await Bookings.find({ user: req.user.id });

  // find tours based on IDs of bookings

  let tourIDs = bookings.map((booking) => booking.tour);

  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
