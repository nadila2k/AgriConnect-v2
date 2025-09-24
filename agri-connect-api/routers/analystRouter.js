const express = require("express");
const router = express.Router();

const {getFarmerAnalyst, getAdminChart,getFarmerChartId } = require("../controller/analystController");

router.route("/").get(getFarmerAnalyst);
router.route("/adminChart").get(getAdminChart);
router.route("/farmerChart").get(getFarmerChartId);
module.exports = router;