const app = require("./app");
const connectDatabase = require("./config/database");
const fileUpload = require("express-fileupload");
const express = require("express");

const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
// const { addListener } = require("nodemon");

//Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

// setting up config file

dotenv.config({ path: "backend/config/config.env" });

// Connecting to database
connectDatabase();

//Settting up cloudinary config
// cloudinary.config()({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

//start of stackoverflow suggestion
//***************************
if (process.env.NODE_ENV === "PRODUCTION") {
  // Exprees will serve up production assets
  app.use(express.static("frontend/build"));

  // Express serve up index.html file if it doesn't recognize route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

const server = app.listen(process.env.PORT, () => {
  console.log(
    `server started on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

//***************************
//end of stack over flow suggestion

//handle unhandleed promise rejections

process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
