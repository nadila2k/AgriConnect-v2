const express = require("express");
const router = express.Router();

const { createCrops, updateCrops ,getAllCrops  } = require("../controller/cropsController");

router.route("/").post(createCrops).get(getAllCrops);
router.route("/:id").put(updateCrops);

module.exports = router;