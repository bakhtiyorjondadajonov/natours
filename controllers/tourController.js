const express = require('express');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utilities/APIFeatures');
const AppError = require('./../utilities/appError');
// ---------REFACTORING OUR ROUTES -------------------

// -------- CATCHING ERRORS IN ASYNC FUNCTIONS ---------- //
const catchAsync = require('./../utilities/catchAsync');
exports.updateTours = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('No tour found with that ID!'), 404);
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
exports.deleteTours = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);
  if (!tour) {
    return next(new AppError('No tour found with that ID!', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
    message: 'deleted',
  });
});
exports.getAtour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);
  if (!tour) {
    return next(new AppError('No tour found with that ID!', 404));
  }
  res.status(200).json({
    message: 'Bismillah',
    data: {
      tour,
    },
  });
});
exports.createTours = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,createdAt,summary,price,ratingsAverage';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sorting()
    .fieldsLimitation()
    .paginate();
  const tours = await features.query;
  res.json({
    results: tours.length,
    message: 'Bismillah',
    data: {
      tours,
    },
  });
});
exports.getTourStates = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, // we use this match aggregation operator to filter the data,this helps us to get the data that matches the requirements.The properity syntax is the same with the syntax of req.query
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numOfTours: { $sum: 1 },
        numOfRatings: { $sum: '$ratingsQuantity' },
        avrRating: { $avg: '$ratingsAverage' },
        avrPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
      },
    },
    {
      $sort: { avrPrice: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      statistics: stats,
    },
  });
});
exports.getMonthlyPlan = async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numOfStarts: -1 },
    },
  ]);
  res.json({
    result: plan.length,
    message: 'Bismillah',
    data: {
      plan,
    },
  });
};
