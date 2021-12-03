const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [250, "Product name may not exceed 250 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please select a category for this product"],
    enum: {
      values: [
        "Bikes",
        "Bike Accessories",
        "Cycling Apparel",
        "Cycling Footwear",
        "Bike Spare Parts",
        "Bike Helmets",
        "Cycling Protection",
        "Nutrition",
      ],
      message: "Please select the correct category for this product",
    },
  },

  brand: {
    type: String,
    required: [true, "Please enter brand name"],
  },

  stock: {
    type: Number,
    required: [true, "Please enter product stock as an integer"],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
