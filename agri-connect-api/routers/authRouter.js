const express = require("express");
const router = express.Router();

const { signUp, signIn, getUserById, updateUser } = require("../controller/authController");
const validate = require("../middleware/validate");
const validateId = require("../middleware/validateId");
const { signUpSchema, signInSchema, updateUserSchema } = require("../validators/auth.validator");

router.route("/signUp").post(validate(signUpSchema), signUp);
router.route("/signIn").post(validate(signInSchema), signIn);

router.route("/:id")
  .get(validateId, getUserById)
  .put(validateId, validate(updateUserSchema), updateUser);

module.exports = router;
