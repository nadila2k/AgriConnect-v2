const express = require("express");
const router = express.Router();

const { createCropsStatistic, updateCropsStatistic ,getAllCropsStatistic,getCropsStatisticById,getCropsByYear  } = require("../controller/cropsStatisticController");

router.route("/").post(createCropsStatistic).get(getAllCropsStatistic);
router.route("/:id").put(updateCropsStatistic).get(getCropsStatisticById);
router.get('/cropsByYear/:yearId', getCropsByYear);


module.exports = router;