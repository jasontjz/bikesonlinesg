const express = require("express");
const app = express();
const path = require("path");

const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");

const path = require("path");

const errorMiddleware = require("./middlewares/errors");

// setting up config file
if (process.env.NODE_ENV !== "PRODUCTION")
  require("dotenv").config({ path: "backend/config/config.env" });

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

//Import all routes

const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);


//Added during section 20.132 (Deployment) - still OK
//connecting to 4000 in production mode to the Atlas MongoDB
//localhost:4000 is rendering properly
//***************************************

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

//***************************************


//Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
