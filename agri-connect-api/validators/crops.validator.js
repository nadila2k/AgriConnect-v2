const Joi = require("joi");

const createCropSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Crop name cannot be empty",
    "string.min": "Crop name must be at least 2 characters long",
    "any.required": "Crop name is required"
  }),
});

const updateCropSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Crop name cannot be empty",
    "string.min": "Crop name must be at least 2 characters long",
    "any.required": "Crop name is required"
  }),
});

module.exports = {
  createCropSchema,
  updateCropSchema,
};
