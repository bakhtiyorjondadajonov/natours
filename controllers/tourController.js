const express = require('express');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utilities/APIFeatures');
// ---------REFACTORING OUR ROUTES -------------------
exports.updateTours = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {}

  res.status(201).json({
    status: 'success',
    data: {
      tour: 'Updated tour here',
    },
  });
};
exports.deleteTours = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      data: null,
      message: 'deleted',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
  console.log(req.body);
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
exports.getAtour = async (req, res) => {
  try {
    const { id } = req.params;
    const aTour = await Tour.findById(id);

    res.status(200).json({
      message: 'Bismillah',
      data: {
        aTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
exports.createTours = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,createdAt,summary,price,ratingsAverage';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
exports.getTourStates = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
