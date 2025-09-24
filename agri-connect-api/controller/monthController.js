const Months = require("../models/monthModel.js");

const getAllMonth = async (req, res) => {
  console.log("getAllMonth called");

  try {
    console.log("Fetching all months...");
    
    const months = await Months.findAll({
      attributes: ['id', 'month'],
    });
    console.log(months)
    res.status(200).json({
      success: true,
      data: months,
    });
    console.log("Fetched months:", months);
  } catch (error) {
    console.error("Error fetching months:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve months",
      error: error.message,
    });
  }
};

module.exports = { getAllMonth };
