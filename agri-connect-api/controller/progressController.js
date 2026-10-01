const progressService = require("../service/progress.service");
const asyncHandler = require("../middleware/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const getAllProgress = asyncHandler(async (req, res) => {
  const progresses = await progressService.getAllProgress();
  return successResponse(res, 200, "Progress retrieved successfully", progresses);
});

module.exports = { getAllProgress };
