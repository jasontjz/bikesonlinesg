const ErrorHandler = require("../utils/errorHandler");
const Order = require("../models/order");
const Product = require("../models/product");

//createa a new order => /api/v1/order/new

exports.newOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
    } = req.body;

    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: req.user._id,
    });
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//get single order => /api/v1/order/:id
exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return next(new ErrorHandler("No such order id", 404));
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//get logged in user orders => /api/v1/order/me
exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//Admin - get all orders => /api/v1/admin/orders/
exports.allOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    let totalOrders = 0;
    orders.forEach((order) => {
      totalOrders += 1;
    });

    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalOrders,
      totalAmount,
      orders,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

//Admin Update / Process orders => /api/v1/admin/order/:id
exports.updateOrders = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === "Delivered") {
      return next(new ErrorHandler("Order has already been delivered", 400));
    }

    order.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.quantity);
    });

    (order.orderStatus = req.body.status), (order.deliveredAt = Date.now());

    await order.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}

//Delete order => /api/v1/admin/order/:id
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("No such order id", 404));
    }

    await order.remove();
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
