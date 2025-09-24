const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("agriceylon", "postgres", "postgres", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
});

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // await sequelize.sync({force:true});
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDb };
