const express = require("express");
const router = express.Router();

const { signUp, signIn,getUserById,updateUser } = require("../controller/authController");

router.route("/signUp").post(signUp);
router.route("/signIn").post(signIn);
router.route("/:id").get(getUserById).put(updateUser);
module.exports = router;
