const express = require('express');
const tourController = require('../controllers/tourController');
const authenticationController = require(`../controllers/authenticationController`);
const reviewController = require(`../controllers/reviewController`);
const reviewsRouter = require('./reviewsRoute');
const router = express.Router();
router.use('/:tourId/reviews', reviewsRouter);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authenticationController.protect,
    authenticationController.restrictTo('admin,lead-guide'),
    tourController.createTours
  );

router.route('/tour-stats').get(tourController.getTourStates);
router
  .route('/monthly-plan/:year')
  .get(
    authenticationController.protect,
    authenticationController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/:id')
  .get(tourController.getAtour)
  .patch(
    authenticationController.protect,
    authenticationController.restrictTo('admin', 'lead-guide'),
    tourController.updateTours
  )
  .delete(
    authenticationController.protect,
    authenticationController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTours
  );

module.exports = router;
