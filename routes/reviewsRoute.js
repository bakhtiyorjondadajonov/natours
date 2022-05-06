const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({ mergeParams: true });
const reviewsController = require('./../controllers/reviewController');
const authenticationController = require('./../controllers/authenticationController');

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authenticationController.protect,
    authenticationController.restrictTo('user'),
    reviewsController.setIdandUser,
    reviewsController.createReview
  );
router
  .route('/:id')
  .delete(
    authenticationController.protect,
    authenticationController.restrictTo('admin'),
    reviewsController.deleteReview
  )
  .get(authenticationController.protect, reviewsController.getReview)
  .patch(
    authenticationController.protect,
    authenticationController.restrictTo('user'),
    reviewsController.updateReview
  );
module.exports = router;
