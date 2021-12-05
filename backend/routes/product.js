const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReviews,
} = require("../controllers/productController");

//authenticator middleware
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

//GET all products
router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProduct);

//PUT a new product
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

//POST edit or delete a new product
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

//PUT a new product review
router.route("/review").put(isAuthenticatedUser, createProductReview);

//GET all the product reviews
router.route("/reviews").get(getProductReviews);

//DELETE the product reviews by id
router.route("/reviews").delete(isAuthenticatedUser, deleteReviews);

module.exports = router;
