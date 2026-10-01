const AppError = require("../utils/AppError");

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown keys
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(", ");
      return next(new AppError(errorMessages, 400));
    }

    req[source] = value;
    next();
  };
};

module.exports = validate;
