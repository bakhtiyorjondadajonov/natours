const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const factory = require('./handleFactory');
const Tour = require('../models/tourModel');
const stripe = require('stripe')(
  'sk_test_51L7BSQAAxAOnpsobTqiq8VKaPieoR3NLXrsgI1I8BYKB12ykBnb9On51PSuEYC6K3JQKxi3IvMFBuIt6bXBoS3j900k6vRcdCz'
);
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get currently booked Tour
  const tour = await Tour.findById(req.params.tourID);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    //information about the session itself
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.name
      .toLowerCase()
      .split(' ')
      .join('-')}`,
    customer_email: req.user.email,
    line_items: [
      //information about the product user purchases
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  //3) Create session as response

  res.status(200).json({
    status: 'success',
    session,
  });
});
