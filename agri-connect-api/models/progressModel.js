const { DataTypes } = require("sequelize");
const { sequelize } = require("./../database/dbConfig");

const Progress = sequelize.define(
  'progress',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Progress;
