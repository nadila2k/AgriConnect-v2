const Progress = require("../models/progressModel.js");

const getAllProgress = async (req, res) => {
  console.log("get All Progress");

  try {
    // Fetch all progress entries from the database
    const progressList = await Progress.findAll({
      attributes: ['id', 'name']
    });

    res.status(200).json({
      success: true,
      data: progressList,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve progress",
      error: error.message,
    });
  }
};

module.exports = { getAllProgress };
