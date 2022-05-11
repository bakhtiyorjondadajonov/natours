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

//latlng: 37.4445049,126.6464892
//tours-within/200/center/37.4445049,126.6464892/unit/mi
exports.getToursWithin = catchAsync(async function (req, res, next) {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitute and longitude in the correct format!!! (lat,lng)',
        400
      )
    );
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    results: tours.length,
    status: 'success',
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitute and longitude in the correct format!!! (lat,lng)',
        400
      )
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
