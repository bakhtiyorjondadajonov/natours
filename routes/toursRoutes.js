const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authenticationController = require(`../controllers/authenticationController`);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/')
  .get(authenticationController.protect, tourController.getAllTours)
  .post(tourController.createTours);

router.route('/tour-stats').get(tourController.getTourStates);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(tourController.getAtour)
  .patch(tourController.updateTours)
  .delete(tourController.deleteTours);

module.exports = router;
