// const { request } = require('../app');
const Review = require('../models/reviewModel');
// const catchAsync = require("../utilities/catchAsync");
const factory = require('./handleFactory');

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.setIdandUser = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
