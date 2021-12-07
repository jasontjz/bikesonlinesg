const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const APIFeatures = require("../utils/apiFeatures");

//create new products => /api/v1/admin/product/new

exports.newProduct = async (req, res, next) => {
  try {
    //records the user id of whoever creates this product
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//get all products => /api/v1/products?keyword=bikes
exports.getProducts = async (req, res, next) => {
  try {
    const resPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resPerPage);

    const products = await apiFeatures.query;

    setTimeout(() => {
      res.status(200).json({
        success: true,
        count: products.length,
        productsCount,
        products,
      });
    }, 2000);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//get single product detail => /api/v1/product/:id

exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//update produxt => api/v1/admin/product/:id

exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//Delete Product = /api/v1/admin/product/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//create new review => /api/v1/review
exports.createProductReview = async (req, res, send) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    //unable to successfully check if the produst has been reviewed by the same user before or not (isReviewed = true)
    // const isReviewed = product.reviews.find(
    //   (r) => r.user.toString() === req.user._id.toString()
    // );

    // if (isReviewed) {
    //   product.reviews.forEach((review) => {
    //     if (review.user.toString() === req.user._id.toString()) {
    //       review.comment = comment;
    //       review.rating = rating;
    //     }
    //   });
    // } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
    // }

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//GET product reviews => /api/v1/reviews

exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//DELETE product reviews => /api/v1/reviews

exports.deleteReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(
      (review) => review._id.toString() !== req.query.id.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
      reviews,
      ratings,
      numOfReviews,
    }),
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      };

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
