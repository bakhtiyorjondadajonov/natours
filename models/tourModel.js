const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModule');
//Creating Schema  Sending Data to DATABASE similar to THE INTERFACE IN TYPESCRIPT
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'],
      unique: true,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    slug: String,
    price: Number,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      default: 7,
      required: [true, 'A tour must have a maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty level'],
      enum: {
        values: ['difficult', 'medium', 'easy'],
        message: 'error ABC',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image Cover'],
    },
    images: {
      type: [String],
    },
    startDates: {
      type: [Date],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: 'String',
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: `User`, //Here is where magic happens
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Middleware (also called pre and post hooks)
// are functions which are passed control during execution of asynchronous
//  functions. Middleware is specified on the schema level and is useful for writing plugins.

// VIRTUAL PROPERITIES // In Mongoose, a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents.
// in order to be able to get VIRTUAL PROPERITIES we need to enable virtuals in tourSchema,options section 👆👆

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));

//   this.guides = await Promise.all(guidesPromises);

//   next();
// });
//DOCUMENT MIDDWARE:runs before .save() and .create()
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });
// tourSchema.post('save', function (doc, next) {
//   //now,we are using post middleware function thus our function has  got access to the doc that has just been saved
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE

tourSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
// tourSchema.post(/^find/, function (docs, next) {
//   //now,we are using post middleware function thus our function has  got access to the docs we have on the database
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);

//   next();
// });

//AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: {
      secretTour: { $ne: true },
    },
  });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);
//👆👆We need our model(for this project the Tours) to create a new collection

module.exports = Tour;
