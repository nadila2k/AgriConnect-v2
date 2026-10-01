const { errorResponse } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      message,
      error: err,
      stack: err.stack,
    });
  }

  // Production error response
  if (err.isOperational) {
    return errorResponse(res, statusCode, message);
  }

  // Programming or unknown errors: don't leak details in production
  console.error("ERROR 💥", err);
  return errorResponse(res, 500, "Something went very wrong!");
};

module.exports = errorHandler;
