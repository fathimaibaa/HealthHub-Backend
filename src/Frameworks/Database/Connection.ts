import mongoose from "mongoose";
import configKeys from "../../Config";

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  try {
    console.log("MONGO_DB_URL =", configKeys.MONGO_DB_URL);
    await mongoose.connect(configKeys.MONGO_DB_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("❌ Database connection failed:");
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;