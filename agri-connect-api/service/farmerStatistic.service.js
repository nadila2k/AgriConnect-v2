const FarmerStatistic = require('../models/farmerStatisticModel');
const CropsStatistic = require('../models/cropsStatisticModel');
const Crops = require("../models/cropsModel");
const Years = require("../models/yearsModel");
const Progress = require("../models/progressModel.js");
const Months = require("../models/monthModel.js");
const AppError = require("../utils/AppError");

const createFarmerStatistic = async (data) => {
  return await FarmerStatistic.create(data);
};

const updateFarmerStatistic = async (id, data) => {
  const [updatedRows] = await FarmerStatistic.update(
    { progressId: data.progressId },
    { where: { id } }
  );
  if (updatedRows === 0) throw new AppError("Farmer statistic not found", 404);
  return true;
};

const getAllFarmerStatistic = async () => {
  return await FarmerStatistic.findAll();
};

const getFarmerStatistic = async (userId) => {
  const stats = await FarmerStatistic.findAll({
    where: { userId },
    include: [
      {
        model: CropsStatistic,
        as: 'cropsStatistic',
        include: [
          { model: Crops, as: 'crop' },
          { model: Years, as: 'year' }
        ]
      },
      { model: Progress, as: 'progress' },
      { model: Months, as: 'month' }
    ],
  });
  if (stats.length === 0) throw new AppError("No farmer statistics found for this user", 404);
  return stats;
};

module.exports = { createFarmerStatistic, updateFarmerStatistic, getAllFarmerStatistic, getFarmerStatistic };
