const mongoose = require('mongoose');

const bookingsSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a tour.'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must have a user.'],
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});
bookingsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
  }).populate({
    path: 'tour',
    select: 'name',
  });
  next();
});
const Bookings = mongoose.model('Bookings', bookingsSchema);
module.exports = Bookings;
