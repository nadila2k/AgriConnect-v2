const Blog = require("../models/blogModel");
const upload = require("../middleware/upload");
const fs = require('fs');
const path = require('path');

const createBlog =async (req,res)=>{
  console.log("create Blog");
  
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false, // Include success flag
        message: err.message || "An error occurred during file upload",
      });
    }

    try {
      const { title, description } = req.body;
      const image = req.file ? req.file.path : null; // Save the image path if available

      // Create the new blog in the database
      const newBlog = await Blog.create({ title, description, image });

      // Send success response
      res.status(201).json({
        success: true, // Include success flag
        message: "Blog created successfully",
        data: newBlog,
      });
    } catch (error) {
      console.error("Error creating blog:", error);

      // Send error response
      res.status(500).json({
        success: false, // Include success flag
        message: "An error occurred while creating the blog",
        error: error.message,
      });
    }
  });
    
}

const getAllBlog =async (req,res)=>{
  console.log("create Blog")

  try {
    
    const blogs = await Blog.findAll({
      attributes: ['id', 'title', 'description', 'image'],
    });

    res.status(200).json({
      message: "Blogs retrieved successfully",
      data: blogs,
    });
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the blogs",
      error: error.message,
    });
  }
}

const updateBlog = async (req, res) => {
  console.log("Update Blog");
  
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    }

    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const newImage = req.file ? req.file.path : null;

      const blog = await Blog.findByPk(id);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found.",
        });
      }

      // Delete the old image file if a new image is uploaded
      if (newImage && blog.image) {
        const oldImagePath = path.join(__dirname, '..', blog.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old image file:", err);
          }
        });
      }

      blog.title = title || blog.title;
      blog.description = description || blog.description;
      blog.image = newImage || blog.image;

      await blog.save();

      res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        data: blog,
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the blog",
        error: error.message,
      });
    }
  });
};

const deleteBlog = async (req, res) => {
  console.log("Delete Blog");

  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    // Delete the image file if it exists
    if (blog.image) {
      const imagePath = path.join(__dirname, '..', blog.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
    }

    await blog.destroy();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the blog",
      error: error.message,
    });
  }
};

module.exports ={ getAllBlog,createBlog,updateBlog,deleteBlog };