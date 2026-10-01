const yearsService = require("../service/years.service");
const asyncHandler = require("../middleware/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const getAllYears = asyncHandler(async (req, res) => {
  const years = await yearsService.getAllYears();
  return successResponse(res, 200, "Years retrieved successfully", years);
});

module.exports = { getAllYears };