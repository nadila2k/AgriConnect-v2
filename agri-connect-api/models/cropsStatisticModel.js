const { DataTypes } = require("sequelize");
const { sequelize } = require("./../database/dbConfig");

const Crops = require('./cropsModel');
const Years = require('./yearsModel'); // Import the Years model

const CropsStatistic = sequelize.define(
  'cropsStatistic',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    weight: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    production: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    cropsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Crops,
        key: 'id',
      },
    },
    yearId: {  
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Years, 
        key: 'id',
      },
    },
  },
  { timestamps: true }
);


module.exports = CropsStatistic;
