const jwt = require("jsonwebtoken");

const createSendToken = (user, statusCode, message, res) => {
  const { id, firstName, lastName, email, district, phoneNumber, role } = user;
 
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  return res.status(statusCode).json({
    status: "success",
    message,
    data: {
      user: {
        id,
        firstName,
        lastName,
        email,
        district,
        phoneNumber,
        role,
      },
    },
  });
};

module.exports = createSendToken;
