const express = require("express");
const router = express.Router();
const { createProduct, updateProduct, deleteProduct, getAllProduct, getProductById, getProduct } = require("../controller/productController");
const validate = require("../middleware/validate");
const validateId = require("../middleware/validateId");
const upload = require("../middleware/upload");
const { productSchema } = require("../validators/product.validator");

router.route("/")
  .get(getAllProduct)
  .post(upload, validate(productSchema), createProduct);

router.route("/:id")
  .get(validateId, getProductById)
  .put(validateId, upload, validate(productSchema), updateProduct)
  .delete(validateId, deleteProduct);

router.route("/user/:userId").get(getProduct);

module.exports = router;
