const fs = require('fs');
const express = require('express');
const User = require('../models/userModule');
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('../utilities/appError');
const factory = require('./handleFactory');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);
// ---------REFACTORING OUR ROUTES -------------- -----
exports.updateUser = factory.updateOne(User);
// exports.updateUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
exports.deleteUser = factory.deleteOne(User);
// exports.deleteUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
exports.getAnuser = factory.getOne(User);
exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined,Please Use Sign Up instead!',
  });
};
exports.getAllUsers = factory.getAll(User);
//----------CREATING FILTERED OBJECT FUNCTION--------------//
const filteredObj = function (obj, ...elements) {
  const myFilteredObj = {};
  Object.keys(obj).forEach((el) => {
    if (elements.includes(el)) myFilteredObj[el] = obj[el];
  });
  return myFilteredObj;
};
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create an error if user posts password data

  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates.Please use /updateMyPassword.'
      )
    );
  }
  const filteredBody = filteredObj(req.body, 'name', 'email');
  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});
