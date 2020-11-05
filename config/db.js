const mongoose = require("mongoose");
const config = require("config");

// const mongoDB = 'mongodb://localhost:27017/DevConnectorDB';
const mongoDB = config.get("mongoURI");

const connectDB = async () => {
  try {
    console.log('Trying to connect to DB...')
    await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Successfully connected to the database");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};


module.exports = connectDB;
