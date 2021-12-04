const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const APIFeatures = require("../utils/apiFeatures");

//create new products => /api/v1/admin/product/new

exports.newProduct = async (req, res, next) => {
  try {
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
    const resPerPage = 4;
    const productCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
      .search()
      .filter();
    //   .pagination(resPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
      success: true,
      count: products.length,
      productCount,
      products,
    });
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
