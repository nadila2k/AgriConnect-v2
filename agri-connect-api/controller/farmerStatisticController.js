const farmerStatisticService = require("../service/farmerStatistic.service");
const asyncHandler = require("../middleware/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const createFarmerStatistic = asyncHandler(async (req, res) => {
  const newStat = await farmerStatisticService.createFarmerStatistic(req.body);
  return successResponse(res, 201, "Farmer statistic created successfully", newStat);
});

const updateFarmerStatistic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await farmerStatisticService.updateFarmerStatistic(id, req.body);
  return successResponse(res, 200, "Progress updated successfully");
});

const getAllFarmerStatistic = asyncHandler(async (req, res) => {
  const stats = await farmerStatisticService.getAllFarmerStatistic();
  return successResponse(res, 200, "Farmer statistics retrieved successfully", stats);
});

const getFarmerStatistic = asyncHandler(async (req, res) => {
  const { id } = req.params; // userId
  const stats = await farmerStatisticService.getFarmerStatistic(id);
  return successResponse(res, 200, "Farmer statistics retrieved successfully", stats);
});

module.exports = { createFarmerStatistic, updateFarmerStatistic, getAllFarmerStatistic, getFarmerStatistic };
