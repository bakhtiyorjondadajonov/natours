const fs = require('fs');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModule');
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('../utilities/appError');
const factory = require('./handleFactory');
//--------CONFIGURING MULTER TO OUR NEEDS

//-----1) GIVING IMAGES A BETTER FILE NAME

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // cb (Call Back) similar to next function but it does not come from express
//     cb(null, 'public/img/users'); //if there is not any error we need to write null to the first element of cb function
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1]; //we are getting the extention of the file we uploaded
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();
//-----2) ALLOWING ONLY IMAGE FILES TO BE UPLOADED
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

//---CREATING UPLOADS
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadUserPhoto = upload.single('photo');
//-------RESIZING USER PHOTOS BY USING NODEJS
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});
//------Updating user data
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
  if (req.file) filteredBody.photo = req.file.filename;
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
// ---------REFACTORING OUR ROUTES -------------- -----
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getAnuser = factory.getOne(User);
exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined,Please Use Sign Up instead!',
  });
};
exports.getAllUsers = factory.getAll(User);

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});
