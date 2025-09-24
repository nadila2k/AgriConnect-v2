const { DataTypes } = require('sequelize');
const { sequelize } = require("./../database/dbConfig");
const User = require('./userModel');
const CropsStatistic = require('./cropsStatisticModel');
const Progress = require('./progressModel'); 
const Months = require('./monthModel');

const FarmerStatistic = sequelize.define(
  'farmerStatistic',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    perch: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    monthId: {  
      type: DataTypes.INTEGER,  // Ensure this matches Months.id
      allowNull: false,
      references: {
        model: Months,
        key: 'id',
      },
    },
    progressId: {  
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Progress,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    cropsStatisticId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CropsStatistic,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

module.exports = FarmerStatistic;

