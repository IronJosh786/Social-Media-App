import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
  } catch (error) {
    console.log("Error while connecting to database: ", error);
    process.exit(1);
  }
};

export default connectToDB;
