const Years = require("../models/yearsModel");

const getAllYears = async (req, res) => {
  console.log("getALl years")

  try {
    console.log("getAllYears called");
    
    
    const years = await Years.findAll({
      attributes: ['id', 'year']
    });

    
    res.status(200).json({
      success: true,
      data: years,
    });
    
  } catch (error) {
    console.error("Error fetching years:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve years",
      error: error.message,
    });
  }
};

module.exports = {getAllYears};