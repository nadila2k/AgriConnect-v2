const Months = require("../models/monthModel.js");

const getAllMonth = async () => {
  return await Months.findAll({ attributes: ['id', 'month'] });
};

module.exports = { getAllMonth };
