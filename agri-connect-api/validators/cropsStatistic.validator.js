const Joi = require("joi");

const cropsStatisticSchema = Joi.object({
  weight: Joi.number().required(),
  production: Joi.number().required(),
  cropsId: Joi.number().required(),
  yearId: Joi.number().required(),
});

module.exports = { cropsStatisticSchema };
