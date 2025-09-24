const express = require("express");
const router = express.Router();

const { createProduct, updateProduct ,deleteProduct,getAllProduct,getProduct,getProductById  } = require("../controller/productController");

router.route("/").post(createProduct).get(getAllProduct);
router.route("/:id").put(updateProduct).delete(deleteProduct).get(getProductById);
router.route("/user/:userId").get(getProduct);

module.exports = router;