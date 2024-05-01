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

//SUGGEST AN ID TO THE FINGERPRINT HARDWARE
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

//REGISTER AN ID POSTED BY THE HARDWARE
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

//ON USER VERIFICATION, TELL SERVER WHO WAS VERIFIED
app.post("/verify-user", (req, res) => {
  const { userId } = req.body;
  let student_data;
  let VerificationDatabase;
  try {
    VerificationDatabase = JSON.parse(fs.readFileSync("./files/verified.json"));
  } catch (err) {
    VerificationDatabase = { ids: [] };
  }
  if (!userId) {
    res.status(404).send({
      success: false,
      message: "registered ID was not found",
      data: {
        verified_id: null,
        total_verified_users: VerificationDatabase?.ids?.length,
      },
    });
  } else {
    try {
      const randomMatric = Math.floor(Math.random() * 100) + 1;
      const random_name = Math.random().toString(36).substring(2);
      student_data = {
        user_id: userId,
        student_name: random_name,
        matric_no: `18/30GC${randomMatric}`,
      };
      const verifiedList = JSON.parse(fs.readFileSync("./files/verified.json"));
      const appended = JSON.stringify({
        ids: [...verifiedList.ids, student_data],
      });

      fs.writeFileSync("./files/verified.json", appended);
      //file written successfully
    } catch (err) {}
    res.status(201).send({
      success: true,
      message: `Student name: ${student_data?.student_name} with Student ID: ${userId} was successfully verified`,
      data: {
        verified_id: userId,
        student_data: student_data,
        total_available_ids:
          1000 - (Number(VerificationDatabase?.ids?.length) + 1),
        total_registered_ids: Number(VerificationDatabase?.ids?.length) + 1,
      },
    });
  }
});

//VIEW ALL REGISTERED IDS
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

//CLEAR ALL REGISTERED IDS
app.get("/should_i_delete_all_records", (req, res) => {
  try {
    Database = JSON.parse(fs.readFileSync("./files/registered.json"));
    res.status(200).send({
      success: true,
      message: `Yes, delete all records from the database`,
      data: {
        reply: 1, //reply should be between 1 or 0
        total_available_ids: 1000 - Number(Database?.ids?.length),
        total_registered_ids: Database?.ids?.length,
      },
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "getting a reply failed, so, don't delete records",
      data: {
        reply: 0,
        total_available_ids: total_available_ids,
        total_registered_ids: total_registered_ids,
      },
    });
  }
});

app.post("/have_i_deleted_all_records", (req, res) => {
  const { reply } = req.body;
  let Database;
  try {
    Database = JSON.parse(fs.readFileSync("./files/registered.json"));
  } catch (err) {
    Database = { ids: [] };
  }
  if (!reply) {
    res.status(404).send({
      success: false,
      message: "please reply with a 1 or 0",
      data: {
        reply: null,
        total_available_ids: 1000 - Number(Database?.ids?.length),
        total_registered_ids: Database?.ids?.length,
      },
    });
  } else {
    try {
      const clearedDB = JSON.stringify({
        ids: [],
      });

      fs.writeFileSync("./files/registered.json", clearedDB);
      //file written successfully
    } catch (err) {}
    res.status(201).send({
      success: true,
      message: `Hardware replied with ${reply}, all data have been cleared`,
      data: {
        reply: reply,
        total_available_ids: 1000,
        total_registered_ids: 0,
      },
    });
  }
});

app.post("/delete_all_verified_users_records", (req, res) => {
  const { reply } = req.body;
  let VerificationDatabase;
  try {
    VerificationDatabase = JSON.parse(fs.readFileSync("./files/verified.json"));
  } catch (err) {
    VerificationDatabase = { ids: [] };
  }
  if (!reply) {
    res.status(404).send({
      success: false,
      message: "please reply with a 1 or 0",
      data: {
        reply: null,
        total_verified_users: VerificationDatabase?.ids?.length,
      },
    });
  } else {
    try {
      const clearedDB = JSON.stringify({
        ids: [],
      });

      fs.writeFileSync("./files/verified.json", clearedDB);
      //file written successfully
    } catch (err) {}
    res.status(201).send({
      success: true,
      message: `Hardware replied with ${reply}, all verified users' history have been cleared`,
      data: {
        reply: reply,
        total_verified_users: 0,
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
