const mongoose = require("mongoose");
const config = require("./env");

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URL + config.DB_NAME, {
      autoIndex: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    console.log(`========================================================`);
    console.log(`MongoDB connected: ${config.DB_NAME}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

module.exports = connectDB;
