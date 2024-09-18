import { User } from "../models/User";
require("dotenv").config()
import mongoose from "mongoose";
import { ROLES } from "../config/ENUM";

const seedDb = async () => {
  try {
    await mongoose.connect(process.env.MongoUri!, {
    });
    console.log("MongoDB Connected...");
    const session = await mongoose.startSession();
    try {
      // const opts = { session };
      //See if User Exists
      let user = await User.findOne({ email: "admin@123.com" });

      if (user) {
        console.log("User already exists");
        process.exit(1);
      }
      const adminUserData = {
        full_name: "Super Admin",
        email: "admin@123.com",
        role: ROLES.ADMIN,
       
        password:
        "ec14c636ae9ea02c5d98ade22a050707fda12bef6197d4ee6780b3e0809e42deb5dddd975ab0af085f339c5cac6aa2d14af346212abc7efc18bc4d431c2b849e.b41bf1c117f6e06f",//123456789Qw!
      };
      let newAdminUser = new User(adminUserData);
      const saveAdmin = await newAdminUser.save();
      if (saveAdmin) {
        console.log("admin created successfully");

        process.exit(1);
      }
    } catch (error) {
      // this will rollback any changes made in the database
      await session.abortTransaction();
      // ending session
      session.endSession();

      console.log("transaction error: ", error);

      //Exit process with Failure
      process.exit(1);
    }
  } catch (error) {
    console.log("mongo connection error", error);
    //Exit Process with Failure
    process.exit(1);
  }
};

seedDb();
