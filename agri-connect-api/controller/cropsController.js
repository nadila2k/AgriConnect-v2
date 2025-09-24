const Crops = require("../models/cropsModel");

const createCrops = async (req, res) => {
  console.log("create crops");
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Crop name is required." });
    }

    const newCrop = await Crops.create({ name });

    res.status(201).json({
      success: true,
      message: "Crop created successfully!",
      data: newCrop,
    });
  } catch (error) {
    console.error("Error creating crop:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create crop",
      error: error.message,
    });
  }
 
};

const updateCrops = async (req, res) => {
  console.log("updateCrops");
  try {
    const { id } = req.params;
    const { name } = req.body; // Assuming you are updating the crop name

    // Find the crop by ID
    const crop = await Crops.findByPk(id);

    // Check if the crop exists
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found.",
      });
    }

    // Update the crop details
    crop.name = name;

    // Save the updated crop
    await crop.save();

    res.status(200).json({
      success: true,
      message: "Crop updated successfully!",
      crop: crop, // Optionally, return the updated crop
    });
  } catch (error) {
    console.error("Error updating crop:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update crop",
      error: error.message,
    });
  }
};

const getAllCrops = async (req, res) => {
  console.log("getallCrops");

  try {
    console.log("getAllCrops");

    const crops = await Crops.findAll({
      attributes: ["id", "name"],
    });

    res.status(200).json({
      success: true,
      data: crops,
    });
  } catch (error) {
    console.error("Error fetching crops:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve crops",
      error: error.message,
    });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params; // Extract blog ID from request parameters

  console.log(`Deleting blog with ID: ${id}`);

  try {
    // Find and delete the blog with the given ID
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete the blog
    await blog.destroy();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

module.exports = { createCrops, updateCrops, getAllCrops,deleteBlog };
