const FarmerStatistic = require('../models/farmerStatisticModel'); // Import the model
const CropsStatistic = require('../models/cropsStatisticModel'); // Import the model
const Crops = require("../models/cropsModel");
const Years = require("../models/yearsModel");
const Progress = require("../models/progressModel.js"); // Fix the Progress import (uppercase)
const Months = require("../models/monthModel.js"); // Import the Months model


// Create Farmer Statistic
const createFarmerStatistic = async (req, res) => {
  try {
    const { perch, monthId, progressId, userId, cropsStatisticId } = req.body;

    const newFarmerStatistic = await FarmerStatistic.create({
      perch,
      monthId,
      progressId,
      userId,
      cropsStatisticId,
    });

    res.status(201).json({
      success: true,
      message: "Farmer statistic created successfully",
      data: newFarmerStatistic,
    });
  } catch (error) {
    console.error("Error creating farmer statistic:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create farmer statistic",
      error: error.message,
    });
  }
};

// Update Farmer Statistic
const updateFarmerStatistic = async (req, res) => {
  try {
    const { id } = req.params; // Get the FarmerStatistic ID from the request params
    const { progressId } = req.body; // Extract only progressId from the request body
  
    // Update only the progressId in the FarmerStatistic
    const [updatedRows] = await FarmerStatistic.update(
      {
        progressId,
      },
      { where: { id } }
    );
  
    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Farmer statistic not found",
      });
    }
  
    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
    });
  } catch (error) {
    console.error("Error updating farmer statistic:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update farmer statistic",
      error: error.message,
    });
  }
  
};

// Get All Farmer Statistics
const getAllFarmerStatistic = async (req, res) => {
  try {
    const farmerStatistics = await FarmerStatistic.findAll();
    res.status(200).json({
      success: true,
      data: farmerStatistics,
    });
  } catch (error) {
    console.error("Error fetching farmer statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch farmer statistics",
      error: error.message,
    });
  }
};

// Get Farmer Statistic by ID
const getFarmerStatistic = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from params
    console.log(id); // Log id to verify

    const farmerStatistics = await FarmerStatistic.findAll({
      where: { userId: id }, // Filter by userId
      include: [
        {
          model: CropsStatistic,
          as: 'cropsStatistic',
          include: [
            { model: Crops, as: 'crop' }, // Include Crops data
            { model: Years, as: 'year' } // Include Years data
          ]
        },
        { model: Progress, as: 'progress' },
        { model: Months, as: 'month' }
      ],
    });

    if (farmerStatistics.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No farmer statistics found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: farmerStatistics,
    });
  } catch (error) {
    console.error("Error fetching farmer statistics by user ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch farmer statistics by user ID",
      error: error.message,
    });
  }


};




module.exports = { createFarmerStatistic, updateFarmerStatistic, getAllFarmerStatistic, getFarmerStatistic };




