const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require('body-parser');

const { connectDb } = require("./database/dbConfig.js");
const User = require("./models/userModel.js");
const Crops = require("./models/cropsModel.js");
const CropsStatistic = require("./models/cropsStatisticModel.js");
const FarmerStatistic = require("./models/farmerStatisticModel.js");
const Product = require("./models/productModel.js");
const Years = require("./models/yearsModel.js");
const Progress = require("./models/progressModel.js");
const Blog = require("./models/blogModel.js");
const Months = require("./models/monthModel");

const app = express();
const port = process.env.PORT || 5000;

// Middleware Stack
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); 
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/api/v1/auth", require("./routers/authRouter"));
app.use("/api/v1/crops", require("./routers/cropsRouter"));
app.use("/api/v1/cropsStatistic", require("./routers/cropsStatisticRouter"));
app.use("/api/v1/farmerStatistic", require("./routers/farmerStatisticRouter"));
app.use("/api/v1/product", require("./routers/productsRouter"));
app.use("/api/v1/years", require("./routers/yearsRouter"));
app.use("/api/v1/progress", require("./routers/progressRouter"));
app.use("/api/v1/blogs", require("./routers/blogRouter"));
app.use("/api/v1/month", require("./routers/monthRouter"));
app.use("/api/v1/analyst", require("./routers/analystRouter"));

// Associations
Crops.hasMany(CropsStatistic, {
  foreignKey: "cropsId",
  as: "cropsStatistics",
});
CropsStatistic.belongsTo(Crops, {
  foreignKey: 'cropsId',
  as: 'crop'
})

// FarmerStatistic to Progress Association
Progress.hasMany(FarmerStatistic, {
  foreignKey: "progressId",
  as: "farmerStatistics",
});
FarmerStatistic.belongsTo(Progress, {
  foreignKey: "progressId",
  as: "progress",
});

// FarmerStatistic to Months Association
Months.hasMany(FarmerStatistic, {
  foreignKey: "monthId",
  as: "farmerStatistics",
});
FarmerStatistic.belongsTo(Months, {
  foreignKey: "monthId",
  as: "month",
});

User.hasMany(FarmerStatistic, {
  foreignKey: "userId",
  as: "farmerStatistics",
});
FarmerStatistic.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

CropsStatistic.hasMany(FarmerStatistic, {
  foreignKey: "cropsStatisticId",
  as: "farmerStatistics",
});
FarmerStatistic.belongsTo(CropsStatistic, {
  foreignKey: "cropsStatisticId",
  as: "cropsStatistic",
});

// In CropsStatistic model file
CropsStatistic.belongsTo(Years, {
  foreignKey: 'yearId',
  as: 'year',
});

// In Years model file
Years.hasMany(CropsStatistic, {
  foreignKey: 'yearId',
  as: 'cropsStatistics',
});

User.hasMany(Product, { foreignKey: "userId", as: "products" });

Product.belongsTo(User, { foreignKey: 'userId', as: 'user' });

app.listen(port, () => {
  connectDb();
  console.log(`app listen ${port}`);
});
