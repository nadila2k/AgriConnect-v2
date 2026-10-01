const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signIn = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (password !== user.password) {
    throw new AppError("Incorrect password.", 401);
  }

  const token = generateToken(user.id);
  return { user, token };
};

const signUp = async (data) => {
  const existingUser = await User.findOne({ where: { email: data.email } });
  if (existingUser) {
    throw new AppError("Email already in use.", 409);
  }

  const newUser = await User.create(data);
  const token = generateToken(newUser.id);
  
  return { user: newUser, token };
};

const getUserById = async (id) => {
  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
};

const updateUser = async (id, data) => {
  const user = await User.findOne({ where: { id } });
  
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  await user.update(data);
  
  return user;
};

module.exports = {
  signIn,
  signUp,
  getUserById,
  updateUser,
};
