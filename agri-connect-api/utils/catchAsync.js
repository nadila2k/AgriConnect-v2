module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      console.error("Error during sign-in:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
    })
  }
}