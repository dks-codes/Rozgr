const mongoose = require("mongoose");

require("dotenv").config();

async function dbConnect() {
  DBURI = `${process.env.MONGODB_URI}`;
  DBNAME = `${process.env.MONGODB_NAME}`;

  try {
    const connectionInstance = await mongoose.connect(`${DBURI}${DBNAME}`);
    console.log(
      `\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
    );
    // throw Error("Error")
  } catch (err) {
    console.log("MongoDB connection error", err);
    process.exit(1);
  }
}

module.exports = dbConnect;
