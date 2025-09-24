const { DataTypes } = require("sequelize");
const { sequelize } = require("./../database/dbConfig");


const User = sequelize.define(
  "user",
  {
    id:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    district:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true }
);


module.exports = User;