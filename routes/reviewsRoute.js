const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const reviewsController = require('./../controllers/reviewController');
const authenticationController = require('./../controllers/authenticationController');

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authenticationController.protect,
    authenticationController.restrictTo('user'),
    reviewsController.createReview
  );
module.exports = router;
