const fs = require('fs');
const express = require('express');
const User = require('../models/userModule');
const catchAsync = require('./../utilities/catchAsync');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);
// ---------REFACTORING OUR ROUTES -------------- -----
exports.updateUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.deleteUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.getAnuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.getAllUsers = catchAsync(async (req, res) => {
  const user = await User.find();
  res.json({
    results: user.length,
    message: 'Bismillah',
    data: {
      user,
    },
  });
});
