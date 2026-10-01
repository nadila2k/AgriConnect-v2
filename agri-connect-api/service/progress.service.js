const Progress = require("../models/progressModel.js");

const getAllProgress = async () => {
  return await Progress.findAll({ attributes: ['id', 'name'] });
};

module.exports = { getAllProgress };
