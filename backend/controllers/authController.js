const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");

const sendToken = require("../utils/jwtToken");

//Register a user => /api/v1/Register

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "random",
        url: "https://www.peterbe.com/avatar.random.png",
      },
    });
    sendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//login user => /api/v1/login
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //checks if email and password is entered by user
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }
    //Finding user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//logout user => /api/v1/logout
exports.logout = async (req, res, next) => {
  try {
    //clearing out hte cookie
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "logged out",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
