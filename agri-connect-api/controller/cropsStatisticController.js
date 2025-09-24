const CropsStatistic = require('../models/cropsStatisticModel'); // Import the model
const Crops = require("../models/cropsModel");
const Years = require("../models/yearsModel");
// Create Crops Statistic
const createCropsStatistic = async (req, res) => {
  try {
    const { weight, production, cropsId, yearId } = req.body;

    const newCropsStatistic = await CropsStatistic.create({
      weight,
      production,
      cropsId,
      yearId,
    });

    res.status(201).json({
      message: "Crops statistic created successfully",
      data: newCropsStatistic,
    });
  } catch (error) {
    console.error("Error creating crops statistic:", error);
    res.status(500).json({ message: "Failed to create crops statistic" });
  }
};

// Update Crops Statistic
const updateCropsStatistic = async (req, res) => {
  try {
    const { id } = req.params;
    const { weight, production, cropsId, yearId } = req.body;

    const updatedCropsStatistic = await CropsStatistic.update(
      {
        weight,
        production,
        cropsId,
        yearId,
      },
      { where: { id } }
    );

    if (updatedCropsStatistic[0] === 0) {
      return res.status(404).json({ message: "Crops statistic not found" });
    }

    res.status(200).json({ message: "Crops statistic updated successfully" });
  } catch (error) {
    console.error("Error updating crops statistic:", error);
    res.status(500).json({ message: "Failed to update crops statistic" });
  }
};

// Get All Crops Statistics
const getAllCropsStatistic = async (req, res) => {
  console.log("getAllCropsStatistic called");

  try {
    // Fetching all crop statistics from the database
    const cropsStatistics = await CropsStatistic.findAll({
      attributes: ['id', 'weight', 'production', 'cropsId', 'yearId'], // Specify attributes if needed
    });

    // Sending response with success status and data
    res.status(200).json({
      success: true,
      data: cropsStatistics,
    });
  } catch (error) {
    // Error handling
    console.error("Error fetching crops statistics:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch crops statistics",
      error: error.message,
    });
  }
};


// Get Crops Statistic by ID
const getCropsStatisticById = async (req, res) => {
  try {
    const { id } = req.params;

    const cropsStatistic = await CropsStatistic.findByPk(id);

    if (!cropsStatistic) {
      return res.status(404).json({ message: "Crops statistic not found" });
    }

    res.status(200).json(cropsStatistic);
  } catch (error) {
    console.error("Error fetching crops statistic:", error);
    res.status(500).json({ message: "Failed to fetch crops statistic" });
  }
};

const getCropsByYear = async (req, res) => {
  let crops = [];
  const { yearId } = req.params;
  try {
    const cropsStatistics = await CropsStatistic.findAll({
      where: { yearId : yearId },
      include: [{ model: Crops, as: 'crop' }],
    });
    
    crops = cropsStatistics?.map(element => {
      return {
        cropsStatisticsId: element.id,
        cropId: element.crop.id,
        name: element.crop.name
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Crops data',
      data: {
        crops
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createCropsStatistic, updateCropsStatistic, getAllCropsStatistic, getCropsStatisticById,getCropsByYear };

