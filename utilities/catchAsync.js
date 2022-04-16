module.exports = catchAsyncFn = (fn) => {
  //we cannot give req,res,next to the fn properity so we will create anonymous fn
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
