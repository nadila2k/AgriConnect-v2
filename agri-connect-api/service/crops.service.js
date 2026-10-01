const Crops = require("../models/cropsModel");
const AppError = require("../utils/AppError");

const createCrop = async (data) => {
  // Check for duplicates
  const existingCrop = await Crops.findOne({ where: { name: data.name } });
  if (existingCrop) {
    throw new AppError("Crop with this name already exists", 409);
  }
  
  const newCrop = await Crops.create(data);
  return newCrop;
};

const updateCrop = async (id, data) => {
  const crop = await Crops.findByPk(id);

  if (!crop) {
    throw new AppError("Crop not found.", 404);
  }

  if (data.name && data.name !== crop.name) {
    const existingCrop = await Crops.findOne({ where: { name: data.name } });
    if (existingCrop) {
      throw new AppError("Another crop with this name already exists", 409);
    }
  }

  crop.name = data.name;
  await crop.save();

  return crop;
};

const getAllCrops = async () => {
  const crops = await Crops.findAll({
    attributes: ["id", "name"],
  });
  return crops;
};

const deleteCrop = async (id) => {
  const crop = await Crops.findByPk(id);

  if (!crop) {
    throw new AppError("Crop not found.", 404);
  }

  await crop.destroy();
  return true;
};

module.exports = {
  createCrop,
  updateCrop,
  getAllCrops,
  deleteCrop,
};
