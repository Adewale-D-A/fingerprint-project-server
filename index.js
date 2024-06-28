const fs = require("fs");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: [
      "*",
      process.env.LOCALHOST,
      process.env.LOCALHOST_1,
      process.env.FRONTEND_DOMAIN,
    ],
    credentials: false,
  })
);

app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const hardware_routes = require("./routes/hardware/index");
const admin_routes = require("./routes/admins/index");
const student_routes = require("./routes/students/index");
const lecturer_routes = require("./routes/lecturers/index");

//all routes to fingerprint's hardware
app.use("/hardware", hardware_routes);
//admin's tasks routes
app.use("/admins", admin_routes);
//student's tasks routes
app.use("/students", student_routes);
//lecturers' tasks routes
app.use("/lecturers", lecturer_routes);

//endpoint home
app.get("/", (req, res) => {
  res.status(200).send("Project server is actively listening");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`project server is listening on ${port}...`);
});
