const fs = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const hardware_routes = require("./hardware-routes/index");
const admin_routes = require("./admins/index");

//all routes to fingerprint's hardware
app.use("/hardware", hardware_routes);
//admin's tasks routes
app.use("/admins", admin_routes);

//endpoint home
app.get("/", (req, res) => {
  res.status(200).send("Project server is actively listening");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`project server is listening on ${port}...`);
});
