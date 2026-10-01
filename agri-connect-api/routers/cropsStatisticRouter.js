const express = require("express");
const router = express.Router();
const { createCropsStatistic, updateCropsStatistic, getAllCropsStatistic, getCropsStatisticById, getCropsByYear } = require("../controller/cropsStatisticController");
const validate = require("../middleware/validate");
const validateId = require("../middleware/validateId");
const { cropsStatisticSchema } = require("../validators/cropsStatistic.validator");

router.route("/")
  .get(getAllCropsStatistic)
  .post(validate(cropsStatisticSchema), createCropsStatistic);

router.route("/:id")
  .get(validateId, getCropsStatisticById)
  .put(validateId, validate(cropsStatisticSchema), updateCropsStatistic);

router.route("/year/:yearId").get(getCropsByYear);

module.exports = router;