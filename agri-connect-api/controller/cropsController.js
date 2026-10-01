const cropsService = require("../service/crops.service");
const asyncHandler = require("../middleware/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const createCrops = asyncHandler(async (req, res) => {
  const newCrop = await cropsService.createCrop(req.body);
  return successResponse(res, 201, "Crop created successfully!", newCrop);
});

const updateCrops = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedCrop = await cropsService.updateCrop(id, req.body);
  return successResponse(res, 200, "Crop updated successfully!", updatedCrop);
});

const getAllCrops = asyncHandler(async (req, res) => {
  const crops = await cropsService.getAllCrops();
  return successResponse(res, 200, "Crops retrieved successfully!", crops);
});

const deleteCrop = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await cropsService.deleteCrop(id);
  return successResponse(res, 200, "Crop deleted successfully!", null);
});

module.exports = { createCrops, updateCrops, getAllCrops, deleteCrop };
