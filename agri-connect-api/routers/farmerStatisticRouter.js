const express = require("express");
const router = express.Router();
const { createFarmerStatistic, updateFarmerStatistic, getAllFarmerStatistic, getFarmerStatistic } = require("../controller/farmerStatisticController");
const validate = require("../middleware/validate");
const validateId = require("../middleware/validateId");
const { createSchema, updateSchema } = require("../validators/farmerStatistic.validator");

router.route("/")
  .get(getAllFarmerStatistic)
  .post(validate(createSchema), createFarmerStatistic);

router.route("/:id")
  .get(validateId, getFarmerStatistic) // Note: this is userId in the controller logic
  .put(validateId, validate(updateSchema), updateFarmerStatistic);

module.exports = router;