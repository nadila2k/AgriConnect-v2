const Blog = require("../models/blogModel");
const AppError = require("../utils/AppError");
const fs = require('fs');
const path = require('path');

const createBlog = async (data) => {
  return await Blog.create(data);
};

const getAllBlog = async () => {
  return await Blog.findAll({
    attributes: ['id', 'title', 'description', 'image'],
  });
};

const updateBlog = async (id, data, newImage) => {
  const blog = await Blog.findByPk(id);
  if (!blog) throw new AppError("Blog not found.", 404);

  if (newImage && blog.image) {
    const oldImagePath = path.join(__dirname, '..', blog.image);
    fs.unlink(oldImagePath, () => {});
  }

  blog.title = data.title || blog.title;
  blog.description = data.description || blog.description;
  blog.image = newImage || blog.image;

  await blog.save();
  return blog;
};

const deleteBlog = async (id) => {
  const blog = await Blog.findByPk(id);
  if (!blog) throw new AppError("Blog not found.", 404);

  if (blog.image) {
    const imagePath = path.join(__dirname, '..', blog.image);
    fs.unlink(imagePath, () => {});
  }

  await blog.destroy();
  return true;
};

module.exports = { createBlog, getAllBlog, updateBlog, deleteBlog };
