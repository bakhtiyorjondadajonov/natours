const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
const bookingsController = require('../controllers/bookingsController');

router.get(
  '/checkout-session/:tourID',
  authenticationController.protect,
  bookingsController.getCheckoutSession
);
module.exports = router;
