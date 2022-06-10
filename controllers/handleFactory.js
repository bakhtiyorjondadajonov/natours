const APIFeatures = require('../utilities/APIFeatures');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new AppError('No document found with that ID!', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
      message: 'deleted',
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(new AppError('No document found with that ID!'), 404);
    }
    res.status(201).json({
      status: 'success',
      data: {
        document,
      },
    });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        document: document,
      },
    });
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findById(id);

    if (popOptions) {
      query = await query.populate(popOptions);
    }
    const document = await query;

    if (!document) {
      return next(new AppError('No document found with that ID!', 404));
    }
    res.status(200).json({
      message: 'Bismillah',
      data: {
        document,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //To allow for nested get reviews on tour(hack)
    const filter = {};
    if (req.params.tourId) filter.tour = req.params.tourId;
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sorting()
      .fieldsLimitation()
      .paginate();
    const document = await features.query;
    // const document = await features.query.explain();
    res.json({
      results: document.length,
      message: 'Bismillah',
      data: {
        document,
      },
    });
  });
