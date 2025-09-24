const { DataTypes } = require("sequelize");
const { sequelize } = require("./../database/dbConfig");

const Years = sequelize.define(
  "years",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Years;
