const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().trim().required(),
  qty: Joi.number().required(),
  description: Joi.string().trim().required(),
  price: Joi.number().required(),
  availability: Joi.number().required(),
  productType: Joi.string().trim().required(),
  userId: Joi.number().required(),
});

module.exports = { productSchema };
