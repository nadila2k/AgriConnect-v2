const AppError = require("../utils/AppError");

const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return next(new AppError("Invalid ID format", 400));
  }
  
  next();
};

module.exports = validateId;
