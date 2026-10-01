require("dotenv").config();
const app = require("./app");
const { connectDb } = require("./database/dbConfig.js");

// Initialize models and their associations
require("./models/index.js");

const port = process.env.PORT || 5000;

app.listen(port, () => {
  connectDb();
  console.log(`Server is running on port ${port}`);
});
