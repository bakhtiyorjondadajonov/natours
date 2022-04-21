const User = require('./../models/userModule');
// -------- CATCHING ERRORS IN ASYNC FUNCTIONS ---------- //
const catchAsync = require('./../utilities/catchAsync');
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
