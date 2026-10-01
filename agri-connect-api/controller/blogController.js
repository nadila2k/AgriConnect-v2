const blogService = require("../service/blog.service");
const asyncHandler = require("../middleware/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const createBlog = asyncHandler(async (req, res) => {
  const data = { title: req.body.title, description: req.body.description, image: req.file ? req.file.path : null };
  const newBlog = await blogService.createBlog(data);
  return successResponse(res, 201, "Blog created successfully", newBlog);
});

const getAllBlog = asyncHandler(async (req, res) => {
  const blogs = await blogService.getAllBlog();
  return successResponse(res, 200, "Blogs retrieved successfully", blogs);
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = { title: req.body.title, description: req.body.description };
  const newImage = req.file ? req.file.path : null;
  const blog = await blogService.updateBlog(id, data, newImage);
  return successResponse(res, 200, "Blog updated successfully", blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await blogService.deleteBlog(id);
  return successResponse(res, 200, "Blog deleted successfully");
});

module.exports = { getAllBlog, createBlog, updateBlog, deleteBlog };