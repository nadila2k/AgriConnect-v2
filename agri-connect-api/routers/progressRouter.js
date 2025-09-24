const express = require("express");
const router = express.Router();

const { getAllProgress } = require("../controller/progressController");

router.route("/").get(getAllProgress);


module.exports = router;