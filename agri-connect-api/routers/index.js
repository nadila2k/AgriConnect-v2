const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRouter"));
router.use("/crops", require("./cropsRouter"));
router.use("/cropsStatistic", require("./cropsStatisticRouter"));
router.use("/farmerStatistic", require("./farmerStatisticRouter"));
router.use("/product", require("./productsRouter"));
router.use("/years", require("./yearsRouter"));
router.use("/progress", require("./progressRouter"));
router.use("/blogs", require("./blogRouter"));
router.use("/month", require("./monthRouter"));
router.use("/analyst", require("./analystRouter"));

module.exports = router;
