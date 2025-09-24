const express = require("express");
const router = express.Router();

const { getAllMonth } = require("../controller/monthController");

router.route("/").get(getAllMonth);


module.exports = router;