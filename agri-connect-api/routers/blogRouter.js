const express = require("express");
const router = express.Router();

const {
  getAllBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blogController");
const upload = require("../middleware/upload");

router.route("/").get(getAllBlog).post(createBlog);

router.route("/:id").get().put(updateBlog).delete(deleteBlog);

module.exports = router;
