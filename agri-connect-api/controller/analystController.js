const analystService = require("../service/analyst.service");
const asyncHandler = require("../middleware/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const getFarmerAnalyst = asyncHandler(async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  const cropsId = req.query.cropsId || 1;
  const results = await analystService.getFarmerAnalyst(year, cropsId);
  return successResponse(res, 200, "Data fetched", { data: results });
});

const getAdminChart = asyncHandler(async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  const progressId = req.query.progressId || 1;
  const results = await analystService.getAdminChart(year, progressId);
  return successResponse(res, 200, "Data fetched", { data: results });
});

const getFarmerChartId = asyncHandler(async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  const userId = req.query.userId;
  const results = await analystService.getFarmerChartId(year, userId);
  return successResponse(res, 200, "Data fetched", { data: results });
});

module.exports = { getFarmerAnalyst, getAdminChart, getFarmerChartId };
