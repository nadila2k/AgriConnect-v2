const Years = require("../models/yearsModel");

const getAllYears = async () => {
  return await Years.findAll({ attributes: ['id', 'year'] });
};

module.exports = { getAllYears };
