const express = require('express');
const viewsController = require('../controllers/viewsController');
const authenticationController = require('../controllers/authenticationController');
const bookingsController = require('../controllers/bookingsController');
const router = express.Router();
router.route('/me').get(authenticationController.protect, viewsController.me);
router
  .route('/my-tours')
  .get(authenticationController.protect, viewsController.getMyTours);
router.use(authenticationController.isLoggedIn);
router
  .route('/')
  .get(bookingsController.createBookingCheckout, viewsController.getOverview);
router.route('/tour/:tourName').get(viewsController.getTour);
router.route('/login').get(viewsController.getLoginForm);
//
module.exports = router;
