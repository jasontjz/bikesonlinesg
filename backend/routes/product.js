const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
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

module.exports = router;
