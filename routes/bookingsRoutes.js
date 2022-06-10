const express = require('express');

const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
const bookingsController = require('../controllers/bookingsController');

router.use(authenticationController.protect);
router
  .route('/')
  .get(bookingsController.getBookings)
  .post(bookingsController.createBookings);
router
  .route('/:id')
  .get(bookingsController.getOneBooking)
  .patch(bookingsController.updateBookings)
  .delete(bookingsController.deleteBookings);
router.get(
  '/checkout-session/:tourID',

  bookingsController.getCheckoutSession
);
module.exports = router;
