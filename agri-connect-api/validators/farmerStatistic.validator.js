const Joi = require("joi");

const createSchema = Joi.object({
  perch: Joi.number().required(),
  monthId: Joi.number().required(),
  progressId: Joi.number().required(),
  userId: Joi.number().required(),
  cropsStatisticId: Joi.number().required(),
});

const updateSchema = Joi.object({
  progressId: Joi.number().required(),
});

module.exports = { createSchema, updateSchema };
