const cropsStatisticService = require("../service/cropsStatistic.service");
const asyncHandler = require("../middleware/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const createCropsStatistic = asyncHandler(async (req, res) => {
  const newStat = await cropsStatisticService.createCropsStatistic(req.body);
  return successResponse(res, 201, "Crops statistic created successfully", newStat);
});

const updateCropsStatistic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await cropsStatisticService.updateCropsStatistic(id, req.body);
  return successResponse(res, 200, "Crops statistic updated successfully");
});

const getAllCropsStatistic = asyncHandler(async (req, res) => {
  const stats = await cropsStatisticService.getAllCropsStatistic();
  return successResponse(res, 200, "Crops statistics retrieved successfully", stats);
});

const getCropsStatisticById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const stat = await cropsStatisticService.getCropsStatisticById(id);
  return successResponse(res, 200, "Crops statistic retrieved successfully", stat);
});

const getCropsByYear = asyncHandler(async (req, res) => {
  const { yearId } = req.params;
  const crops = await cropsStatisticService.getCropsByYear(yearId);
  return successResponse(res, 200, "Crops data retrieved successfully", { crops });
});

module.exports = { createCropsStatistic, updateCropsStatistic, getAllCropsStatistic, getCropsStatisticById, getCropsByYear };
