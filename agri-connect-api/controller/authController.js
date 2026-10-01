const authService = require("../service/auth.service");
const asyncHandler = require("../middleware/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
};

const formatUserData = (user) => {
  const { id, firstName, lastName, email, district, phoneNumber, role } = user;
  return { id, firstName, lastName, email, district, phoneNumber, role };
};

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.signIn(email, password);
  
  setTokenCookie(res, token);
  return successResponse(res, 200, "Sign in successful!", { user: formatUserData(user) });
});

const signUp = asyncHandler(async (req, res) => {
  const { user, token } = await authService.signUp(req.body);
  
  setTokenCookie(res, token);
  return successResponse(res, 201, "User registered successfully!", { user: formatUserData(user) });
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await authService.getUserById(id);
  return successResponse(res, 200, "User retrieved successfully", user);
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await authService.updateUser(id, req.body);
  return successResponse(res, 200, "User updated successfully", user);
});

module.exports = { signIn, signUp, getUserById, updateUser };
