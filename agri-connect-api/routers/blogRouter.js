const express = require("express");
const router = express.Router();
const { getAllBlog, createBlog, updateBlog, deleteBlog } = require("../controller/blogController");
const validate = require("../middleware/validate");
const validateId = require("../middleware/validateId");
const upload = require("../middleware/upload");
const { blogSchema } = require("../validators/blog.validator");

router.route("/")
  .get(getAllBlog)
  .post(upload, validate(blogSchema), createBlog);

router.route("/:id")
  .put(validateId, upload, validate(blogSchema), updateBlog)
  .delete(validateId, deleteBlog);

module.exports = router;
