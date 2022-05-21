const Tour = require('../models/tourModel');
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

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
exports.getLoginForm = catchAsync(async (req, res, next) => {
  console.log('Bismillah');
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});
