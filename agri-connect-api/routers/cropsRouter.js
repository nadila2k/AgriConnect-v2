const express = require("express");
const router = express.Router();

const { createCrops, updateCrops, getAllCrops, deleteCrop } = require("../controller/cropsController");
const validate = require("../middleware/validate");
const validateId = require("../middleware/validateId");
const { createCropSchema, updateCropSchema } = require("../validators/crops.validator");

router.route("/")
  .post(validate(createCropSchema), createCrops)
  .get(getAllCrops);

router.route("/:id")
  .put(validateId, validate(updateCropSchema), updateCrops)
  .delete(validateId, deleteCrop);

module.exports = router;