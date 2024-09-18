import mongoose from "mongoose";
import { config } from "./configBasic";
const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(config.MONGODB.MONGOURI!);
    console.log("MongoDB Connected...");
  } catch (error:any) {
    console.log(error.message);
    //Exit Process with Failure
    process.exit(1);
  }
};

export default connectDB;
