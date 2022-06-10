const express = require('express');
// const mongoose = require('mongoose');
const router = express.Router({ mergeParams: true });
const reviewsController = require('../controllers/reviewController');
const authenticationController = require('../controllers/authenticationController');

router.use(authenticationController.protect);
router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authenticationController.restrictTo('user'),
    reviewsController.setIdandUser,
    reviewsController.createReview
  );
router
  .route('/:id')
  .delete(
    authenticationController.restrictTo('admin', 'user'),
    reviewsController.deleteReview
  )
  .get(reviewsController.getReview)
  .patch(
    authenticationController.restrictTo('user', 'admin'),
    reviewsController.updateReview
  );
module.exports = router;
