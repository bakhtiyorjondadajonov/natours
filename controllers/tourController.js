const express = require('express');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utilities/APIFeatures');
const AppError = require('./../utilities/appError');
const factory = require('./handleFactory');
// ---------REFACTORING OUR ROUTES -------------------

// -------- CATCHING ERRORS IN ASYNC FUNCTIONS ---------- //
const catchAsync = require('./../utilities/catchAsync');
const Review = require('../models/reviewModel');
exports.updateTours = factory.updateOne(Tour);
exports.deleteTours = factory.deleteOne(Tour);
exports.createTours = factory.createOne(Tour);

exports.getAtour = factory.getOne(Tour, { path: 'reviews' });

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,createdAt,summary,price,ratingsAverage';
  next();
};
exports.getAllTours = factory.getAll(Tour);
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
