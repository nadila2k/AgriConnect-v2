const User = require("./userModel");
const Crops = require("./cropsModel");
const CropsStatistic = require("./cropsStatisticModel");
const FarmerStatistic = require("./farmerStatisticModel");
const Product = require("./productModel");
const Years = require("./yearsModel");
const Progress = require("./progressModel");
const Blog = require("./blogModel");
const Months = require("./monthModel");

// --- Associations ---

// Crops <-> CropsStatistic
Crops.hasMany(CropsStatistic, { foreignKey: "cropsId", as: "cropsStatistics" });
CropsStatistic.belongsTo(Crops, { foreignKey: 'cropsId', as: 'crop' });

// Progress <-> FarmerStatistic
Progress.hasMany(FarmerStatistic, { foreignKey: "progressId", as: "farmerStatistics" });
FarmerStatistic.belongsTo(Progress, { foreignKey: "progressId", as: "progress" });

// Months <-> FarmerStatistic
Months.hasMany(FarmerStatistic, { foreignKey: "monthId", as: "farmerStatistics" });
FarmerStatistic.belongsTo(Months, { foreignKey: "monthId", as: "month" });

// User <-> FarmerStatistic
User.hasMany(FarmerStatistic, { foreignKey: "userId", as: "farmerStatistics" });
FarmerStatistic.belongsTo(User, { foreignKey: "userId", as: "user" });

// CropsStatistic <-> FarmerStatistic
CropsStatistic.hasMany(FarmerStatistic, { foreignKey: "cropsStatisticId", as: "farmerStatistics" });
FarmerStatistic.belongsTo(CropsStatistic, { foreignKey: "cropsStatisticId", as: "cropsStatistic" });

// Years <-> CropsStatistic
CropsStatistic.belongsTo(Years, { foreignKey: 'yearId', as: 'year' });
Years.hasMany(CropsStatistic, { foreignKey: 'yearId', as: 'cropsStatistics' });

// User <-> Product
User.hasMany(Product, { foreignKey: "userId", as: "products" });
Product.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Crops,
  CropsStatistic,
  FarmerStatistic,
  Product,
  Years,
  Progress,
  Blog,
  Months
};
