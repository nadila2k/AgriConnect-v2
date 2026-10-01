const monthService = require("../service/month.service");
const asyncHandler = require("../middleware/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const getAllMonth = asyncHandler(async (req, res) => {
  const months = await monthService.getAllMonth();
  return successResponse(res, 200, "Months retrieved successfully", months);
});

module.exports = { getAllMonth };
