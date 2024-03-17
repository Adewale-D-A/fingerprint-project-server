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

//TODO: Logic to get dynamic variables for total available and registered IDS
const total_available_ids = 543;
const total_registered_ids = 422;

app.post("/registered-id", (req, res) => {
  const { userId } = req.body;
  let Database;
  try {
    Database = JSON.parse(fs.readFileSync("./files/registered.json"));
  } catch (err) {
    Database = { ids: [] };
  }
  if (!userId) {
    res.status(404).send({
      success: false,
      message: "resgistered ID was not found",
      data: {
        registered_id: null,
        total_available_ids: 1000 - Number(Database?.ids?.length),
        total_registered_ids: Database?.ids?.length,
      },
    });
  } else {
    try {
      const resgistedList = JSON.parse(
        fs.readFileSync("./files/registered.json")
      );
      const appended = JSON.stringify({
        ids: [...resgistedList.ids, userId],
      });

      fs.writeFileSync("./files/registered.json", appended);
      //file written successfully
    } catch (err) {}
    res.status(201).send({
      success: true,
      message: `ID - ${userId} successfully registered`,
      data: {
        registered_id: userId,
        total_available_ids: 1000 - (Number(Database?.ids?.length) + 1),
        total_registered_ids: Number(Database?.ids?.length) + 1,
      },
    });
  }
});

app.get("/suggested-id", (req, res) => {
  const suggested_id = Math.floor(Math.random() * 1000) + 1;
  let Database;
  try {
    Database = JSON.parse(fs.readFileSync("./files/registered.json"));
  } catch (err) {
    Database = { ids: [] };
  }

  res.status(200).send({
    success: true,
    message: `returning suggested ID in data ${suggested_id}`,
    data: {
      suggested_id: suggested_id,
      total_available_ids: 1000 - Number(Database?.ids?.length),
      total_registered_ids: Database?.ids?.length,
    },
  });
});

app.get("/all-registered-ids", (req, res) => {
  try {
    const Database = JSON.parse(fs.readFileSync("./files/registered.json"));
    res.status(200).send({
      success: true,
      message: `returning all registered IDS in the DB`,
      data: {
        id_list: Database?.ids,
        total_available_ids: 1000 - Number(Database?.ids?.length),
        total_registered_ids: Database?.ids?.length,
      },
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "fetching registered IDS failed",
      data: {
        id_list: [],
        total_available_ids: total_available_ids,
        total_registered_ids: total_registered_ids,
      },
    });
  }
});

//endpoint home
app.get("/", (req, res) => {
  res.status(200).send("Project server is actively listening");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`project server is listening on ${port}...`);
});
