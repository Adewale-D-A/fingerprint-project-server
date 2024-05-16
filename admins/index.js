const express = require("express");
const fs = require("fs");
const router = express.Router();

const registeredDB_url = "./files/registered.json";
const verifiedDB_url = "./files/verified.json";
const isToDeleteDB_url = "./files/idToDelete.json";
const purge_url = "./files/purgeState.json";
const mode_url = "./files//mode.json";

//TODO: Logic to get dynamic variables for total available and registered IDS
const total_available_ids = 543;
const total_registered_ids = 422;

//VIEW ALL REGISTERED IDS
router.get("/all-registered-ids", (req, res) => {
  try {
    const Database = JSON.parse(fs.readFileSync(registeredDB_url));
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

//SET ID TO DELETE
router.post("/set-id-to-delete", (req, res) => {
  const { userId } = req.body;
  let Database;
  try {
    Database = JSON.parse(fs.readFileSync(registeredDB_url));
  } catch (err) {
    Database = { ids: [] };
  }
  if (userId) {
    const random_name = Math.random().toString(36).substring(2);
    const randomMatric = Math.floor(Math.random() * 100) + 1;

    const student_data = {
      user_id: userId,
      student_name: random_name,
      matric_no: `18/30GC${randomMatric}`,
    };
    try {
      const addedId = JSON.stringify({ id: userId });
      fs.writeFileSync(isToDeleteDB_url, addedId);
      res.status(200).send({
        success: true,
        message: `ID to delete has been set to ${userId}`,
        data: {
          reply: 1, //either 1 or 0
          student_data,
          total_available_ids: 1000 - Number(Database?.ids?.length),
          total_registered_ids: Database?.ids?.length,
        },
      });
    } catch (error) {
      console.log({ error });
      res.status(404).send({
        success: false,
        message: "failed to add ID to 'delete ID' register",
        data: {
          delete_id: userId,
          total_registered_users: Database?.ids?.length,
        },
      });
    }
  } else {
    res.status(404).send({
      success: false,
      message: "invalid request body, please add user ID to request",
      data: {
        delete_id: null,
        total_registered_users: Database?.ids?.length,
      },
    });
  }
});

//SET PURGE STATE
router.post("/set-purge-state", (req, res) => {
  const { reply } = req.body; //1 or 0
  if (Number(reply)) {
    try {
      const state_of_purge = JSON.stringify({ state: reply });
      fs.writeFileSync(purge_url, state_of_purge);
      res.status(200).send({
        success: true,
        message: `System's purge has been set to ${reply}`,
        data: {
          reply: reply, //either 1 or 0
        },
      });
    } catch (error) {
      res.status(404).send({
        success: false,
        message: "failed to set purge state",
        data: {
          reply: reply,
        },
      });
    }
  } else {
    try {
      const state_of_purge = JSON.stringify({ state: 0 });
      fs.writeFileSync(purge_url, state_of_purge);
      res.status(200).send({
        success: true,
        message: `System's purge has been set to ${0}`,
        data: {
          reply: 0, //either 1 or 0
        },
      });
    } catch (error) {
      res.status(404).send({
        success: false,
        message: "failed to set purge state",
        data: {
          reply: reply,
        },
      });
    }
  }
});

//DELETE ALL VERIFIED USERS' HISTORY
router.get("/all-verified-records", (req, res) => {
  try {
    const Database = JSON.parse(fs.readFileSync(verifiedDB_url));
    res.status(200).send({
      success: true,
      message: `returning all verified IDS in the DB`,
      data: {
        id_list: Database?.ids,
      },
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "fetching registered IDS failed",
      data: {
        id_list: [],
      },
    });
  }
});

//DELETE ALL VERIFIED USERS' HISTORY
router.post("/delete_all_verified_users_records", (req, res) => {
  const { reply } = req.body;
  let VerificationDatabase;
  try {
    VerificationDatabase = JSON.parse(fs.readFileSync(verifiedDB_url));
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

      fs.writeFileSync(verifiedDB_url, clearedDB);
      //file written successfully
    } catch (err) {}
    res.status(201).send({
      success: true,
      message: `Admin replied with ${reply}, all verified users' history have been cleared`,
      data: {
        reply: reply,
        total_verified_users: 0,
      },
    });
  }
});

//DELETE ALL VERIFIED USERS' HISTORY
router.post("/set_mode", (req, res) => {
  const { mode_id } = req.body; //1,2,3,4 or > 4 for locking device
  if (Number(mode_id)) {
    try {
      const mode_state = JSON.stringify({ mode: mode_id });
      fs.writeFileSync(mode_url, mode_state);
      res.status(200).send({
        success: true,
        message: `System mode has been set to ${mode_state} - ${
          mode_id === 1
            ? "regisration mode"
            : mode_id === 2
            ? "verification mode"
            : mode_id === 3
            ? "delete a user mode"
            : mode_id === 4
            ? "delete all users mode"
            : "locked mode"
        }`,
        data: {
          mode_id,
        },
      });
    } catch (error) {
      res.status(404).send({
        success: false,
        message: "mode failed to set",
        data: {
          mode_id,
        },
      });
    }
  } else {
    res.status(404).send({
      success: false,
      message: "please enter a valid mode",
      data: {
        mode_id,
      },
    });
  }
});
module.exports = router;
