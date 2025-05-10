import mongoose from "mongoose";
import config from "../config/config";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.MONGODB_URI_DEV;

    await mongoose.connect(mongoURI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
