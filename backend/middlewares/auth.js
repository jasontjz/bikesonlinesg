const catchAsyncErrors = require("./catchAsyncErrors");

//checks if user is authenticated or not

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  console.log(token);
});
