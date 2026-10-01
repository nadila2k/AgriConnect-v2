const CropsStatistic = require('../models/cropsStatisticModel');
const Crops = require("../models/cropsModel");
const AppError = require("../utils/AppError");

const createCropsStatistic = async (data) => {
  return await CropsStatistic.create(data);
};

const updateCropsStatistic = async (id, data) => {
  const [updatedRows] = await CropsStatistic.update(data, { where: { id } });
  if (updatedRows === 0) throw new AppError("Crops statistic not found", 404);
  return true;
};

const getAllCropsStatistic = async () => {
  return await CropsStatistic.findAll({
    attributes: ['id', 'weight', 'production', 'cropsId', 'yearId'],
  });
};

const getCropsStatisticById = async (id) => {
  const stat = await CropsStatistic.findByPk(id);
  if (!stat) throw new AppError("Crops statistic not found", 404);
  return stat;
};

const getCropsByYear = async (yearId) => {
  const cropsStatistics = await CropsStatistic.findAll({
    where: { yearId },
    include: [{ model: Crops, as: 'crop' }],
  });
  return cropsStatistics.map(element => ({
    cropsStatisticsId: element.id,
    cropId: element.crop.id,
    name: element.crop.name
  }));
};

module.exports = { createCropsStatistic, updateCropsStatistic, getAllCropsStatistic, getCropsStatisticById, getCropsByYear };
