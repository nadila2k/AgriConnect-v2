const Joi = require("joi");

const blogSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
});

module.exports = { blogSchema };
