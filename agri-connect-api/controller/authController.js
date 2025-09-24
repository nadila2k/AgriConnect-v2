const User = require("../models/userModel");
const createSendToken = require("../service/createSendToken");

const signIn = async (req, res) => {
  console.log("Sign in");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    if (user) {
      createSendToken(user, 200, 'Sign in successful!', res);
    } else {
      throw new Error("Error when user sign-in");
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

const signUp = async (req, res, next) => {
  console.log("Sigin up");
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      district,
      phoneNumber,
      role,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !district ||
      !phoneNumber ||
      !role
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      district,
      phoneNumber,
      role
    });

    if (newUser) {
      createSendToken(newUser, 201, 'User registered successfully!', res);
    } else {
      throw new Error("Error when user creating");
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

const getUserById = async (req, res) => {
  console.log("Fetching user by ID");
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });

  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving the user",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  console.log("Updating user by ID");
  try {
    const { id } = req.params;
    const { firstName, lastName, email, district, phoneNumber } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !district || !phoneNumber) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check if user exists
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Update user details
    await user.update({
      firstName,
      lastName,
      email,
      district,
      phoneNumber,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the user",
      error: error.message,
    });
  }
};
module.exports = { signIn, signUp ,getUserById ,updateUser};
