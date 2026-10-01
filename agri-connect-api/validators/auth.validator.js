const Joi = require("joi");

const signUpSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  district: Joi.string().trim().required(),
  phoneNumber: Joi.string().trim().required(),
  role: Joi.string().trim().required(),
});

const signInSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  district: Joi.string().trim().required(),
  phoneNumber: Joi.string().trim().required(),
});

module.exports = {
  signUpSchema,
  signInSchema,
  updateUserSchema,
};
