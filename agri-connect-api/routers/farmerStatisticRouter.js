const express = require("express");
const router = express.Router();

const { createFarmerStatistic, updateFarmerStatistic ,getAllFarmerStatistic,getFarmerStatistic  } = require("../controller/farmerStatisticController");

router.route("/").post(createFarmerStatistic).get(getAllFarmerStatistic);
router.route("/:id").put(updateFarmerStatistic).get(getFarmerStatistic);



module.exports = router;