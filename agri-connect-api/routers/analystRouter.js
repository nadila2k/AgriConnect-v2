const express = require("express");
const router = express.Router();
const { getFarmerAnalyst, getAdminChart, getFarmerChartId } = require("../controller/analystController");

router.route("/farmerAnalyst").get(getFarmerAnalyst);
router.route("/adminChart").get(getAdminChart);
router.route("/farmerChartId").get(getFarmerChartId);

module.exports = router;