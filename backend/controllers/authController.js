const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");

const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//Register a user => /api/v1/Register

exports.registerUser = async (req, res, next) => {
  try {
    // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //   folder: "avatars",
    //   width: 150,
    //   crop: "scale",
    // });

    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      // avatar: {
      //   public_id: result.public_id,
      //   url: result.secure_url,
      // },
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
    console.log(user);

    sendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//Forgot password => /api/v1/password/Forgot
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new ErrorHandler("No user with such email address found", 404)
      );
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    //create reset password url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset request was successful - please go here to reset:\n\n${resetUrl}\n\nIf you have not requested this, please ignore.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "bikesonlinesg password recovery",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to: ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//Reset password => /api/v1/password/reset/:token
exports.resetPassword = async (req, res, next) => {
  try {
    //hash url token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      //check that the expiry date of the token is not expired yet
      //   resetPasswordExpire: { $gt: Date.now() },
    });

    //check whether the password matches
    if (req.body.password != req.body.confirmPassword) {
      return next(new ErrorHandler("Passwords do not match", 400));
    }
    //check if the user matches the database - if this block of code is put above the 'check whether password matches' code block, it will always fail
    if (!user) {
      return next(
        new ErrorHandler("Password token is not valid or expired", 400)
      );
    }
    //set up new Password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//get currently logged in user details => /api/v1/me

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//update change password => /api/v1/password/update

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    //check previous user password

    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
      return next(new ErrorHandler("old password is incorrect", 400));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//update user profile => /api/v1/me/update
exports.updateProfile = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    //update avatar: To do

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
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

//Admin routes

//get all users => /api/v1/admin/users
exports.allUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//Get user details => /api/v1/admin/user/:id
exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler(`No such user id: ${req.params.id}`));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//Admin - update user profile for admin => /api/v1/admin/user/:id
exports.updateUser = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    //update avatar: To do

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//Admin - delete user details => /api/v1/admin/user/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler(`No such user id: ${req.params.id}`));
    }
    //remove avatar from cloudinary - to do later
    await user.remove();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
