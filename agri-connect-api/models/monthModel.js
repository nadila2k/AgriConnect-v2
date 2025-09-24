const { DataTypes } = require("sequelize");
const { sequelize } = require("./../database/dbConfig");

const Months = sequelize.define(
  "month",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Months;

