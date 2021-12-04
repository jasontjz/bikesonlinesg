const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");

//checks if user is authenticated or not
exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler("You're not logged in yet", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
