const express = require("express");
const fs = require("fs");
const {
  RetrieveStudentById,
} = require("../../MySql/scripts/students/get_student_by_id");
const { SuggestId } = require("../../MySql/scripts/admin/suggest_id");
const {
  ChangeSuggestIdStatus,
} = require("../../MySql/scripts/admin/update_suggest_id_status");
const router = express.Router();

const registeredDB_url = "./files/registered.json";
const isToDeleteDB_url = "./files/idToDelete.json";
const purge_url = "./files/purgeState.json";
const mode_url = "./files//mode.json";
//TODO: Logic to get dynamic variables for total available and registered IDS
const total_available_ids = 543;
const total_registered_ids = 422;

//SUGGEST AN ID TO THE FINGERPRINT HARDWARE
router.get("/suggested-id", (req, res) => {
  SuggestId({ response: res });
});

//REGISTER AN ID POSTED BY THE HARDWARE
router.post("/registered-id", (req, res) => {
  const { userId } = req.body;
  if (userId) {
    ChangeSuggestIdStatus({ response: res, registered_id: Number(userId) });
  } else {
    res.status(400).send({
      success: false,
      message: "invalid request - userId is required",
      data: {
        userId: "registered id",
      },
    });
  }
});

//ON USER VERIFICATION, TELL SERVER WHO WAS VERIFIED
router.post("/verify-user", (req, res) => {
  const { userId } = req.body;
  try {
    if (userId) {
      RetrieveStudentById({
        response: res,
        hardware_id: userId,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "invalid request - userId is required",
        data: {
          userId: "firstname*",
        },
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Ooops! Sorry, something went wrong.",
      data: {
        error: error,
      },
    });
  }

  // let student_data;
  // let VerificationDatabase;
  // try {
  //   VerificationDatabase = JSON.parse(fs.readFileSync(verifiedDB_url));
  // } catch (err) {
  //   VerificationDatabase = { ids: [] };
  // }
  // if (!userId) {
  //   res.status(404).send({
  //     success: false,
  //     message: "registered ID was not found",
  //     data: {
  //       verified_id: null,
  //       total_verified_users: VerificationDatabase?.ids?.length,
  //     },
  //   });
  // } else {
  //   try {
  //     const randomMatric = Math.floor(Math.random() * 100) + 1;
  //     const random_name = Math.random().toString(36).substring(2);
  //     student_data = {
  //       user_id: userId,
  //       student_name: random_name,
  //       matric_no: `18/30GC${randomMatric}`,
  //     };
  //     const verifiedList = JSON.parse(fs.readFileSync(verifiedDB_url));
  //     const appended = JSON.stringify({
  //       ids: [...verifiedList.ids, student_data],
  //     });

  //     fs.writeFileSync(verifiedDB_url, appended);
  //     //file written successfully
  //   } catch (err) {}
  //   res.status(201).send({
  //     success: true,
  //     message: `Student name: ${student_data?.student_name} with Student ID: ${userId} was successfully verified`,
  //     data: {
  //       verified_id: userId,
  //       student_data: student_data,
  //       total_available_ids:
  //         1000 - (Number(VerificationDatabase?.ids?.length) + 1),
  //       total_registered_ids: Number(VerificationDatabase?.ids?.length) + 1,
  //     },
  //   });
  // }
});

//SEND ID TO DELETE
router.get("/id-to-delete", (req, res) => {
  let id_to_delete;
  let Database;

  try {
    id_to_delete = JSON.parse(fs.readFileSync(isToDeleteDB_url));
    Database = JSON.parse(fs.readFileSync(registeredDB_url));
  } catch (error) {
    id_to_delete = { id: "" };
    Database = { ids: [] };
  }

  if (id_to_delete?.id) {
    const random_name = Math.random().toString(36).substring(2);
    const randomMatric = Math.floor(Math.random() * 100) + 1;

    const student_data = {
      user_id: id_to_delete?.id,
      student_name: random_name,
      matric_no: `18/30GC${randomMatric}`,
    };
    res.status(200).send({
      success: true,
      message: `ID to delete is ${id_to_delete?.id}`,
      data: {
        reply: 1, //either 1 or 0
        student_data,
        total_available_ids: 1000 - Number(Database?.ids?.length),
        total_registered_ids: Database?.ids?.length,
      },
    });
  } else {
    res.status(404).send({
      success: false,
      message:
        "no ID registered for delete at the moment, please try again later",
      data: {
        deletable_id: null,
        total_registered_ids: Database?.ids?.length,
      },
    });
  }
});

//CONFIRM ID IS DELETED ON HARDWARE TO REMOVE FROM SERVER'S DB
router.post("/remove-id-from-server", (req, res) => {
  const { userId } = req.body;
  let Database;
  try {
    Database = JSON.parse(fs.readFileSync(registeredDB_url));
  } catch (error) {
    Database = { ids: [] };
  }

  if (Number(userId)) {
    const random_name = Math.random().toString(36).substring(2);
    const randomMatric = Math.floor(Math.random() * 100) + 1;

    const student_data = {
      user_id: userId,
      student_name: random_name,
      matric_no: `18/30GC${randomMatric}`,
    };
    try {
      const newDBcopy = { ...Database }.ids;
      const foundIndex = newDBcopy?.findIndex(
        (id) => Number(id) === Number(userId)
      );

      if (foundIndex > -1) {
        newDBcopy.splice(foundIndex, 1);
        const removedId = JSON.stringify({
          ids: newDBcopy,
        });

        const resetIdState = JSON.stringify({ id: "" });

        fs.writeFileSync(registeredDB_url, removedId);
        fs.writeFileSync(isToDeleteDB_url, resetIdState); //reset ID state
        res.status(200).send({
          success: true,
          message: `ID removed from database is ${userId}`,
          data: {
            reply: 1, //either 1 or 0
            student_data,
            total_available_ids: 1000 - Number(Database?.ids?.length),
            total_registered_ids: Database?.ids?.length,
          },
        });
      } else {
        res.status(404).send({
          success: false,
          message: `ID - ${userId} was not found on server's database`,
          data: {
            deletable_id: userId,
            total_registered_ids: Database?.ids?.length,
          },
        });
      }
    } catch (error) {
      res.status(404).send({
        success: false,
        message: "failed to remove ID",
        data: {
          deletable_id: userId,
          total_registered_ids: Database?.ids?.length,
        },
      });
    }
  } else {
    res.status(404).send({
      success: false,
      message: "invalid request body, please provide deleted ID",
      data: {
        deletable_id: null,
        total_registered_ids: Database?.ids?.length,
      },
    });
  }
});

//CHECK WITH SERVER IF IT IS OKAY TO CLEAR ALL REGISTERED IDS ON HARDWARE
router.get("/should_i_delete_all_records", (req, res) => {
  try {
    const purgeState = JSON.parse(fs.readFileSync(purge_url));
    if (purgeState?.state > 0) {
      res.status(200).send({
        success: true,
        message: `Yes, delete all records from the database`,
        data: {
          reply: purgeState?.state, //reply should be between 1 or 0
        },
      });
    } else {
      res.status(200).send({
        success: true,
        message: `No, do not delete any record from the database`,
        data: {
          reply: purgeState?.state, //reply should be between 1 or 0
        },
      });
    }
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

//INFORM SERVER THAT ALL STORED DATA ON HARDWARE HAVE BEEN CLEARED
router.post("/have_i_deleted_all_records", (req, res) => {
  const { reply } = req.body;
  let Database;
  try {
    Database = JSON.parse(fs.readFileSync(registeredDB_url));
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

      fs.writeFileSync(registeredDB_url, clearedDB);
      const state_of_purge = JSON.stringify({ state: 0 });
      fs.writeFileSync(purge_url, state_of_purge);
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

//GET MODE
router.get("/mode", (req, res) => {
  try {
    const modeState = JSON.parse(fs.readFileSync(mode_url));
    const mode_id = modeState?.mode;
    const modeNumber = Number(mode_id);

    res.status(200).send({
      success: true,
      message: `Device mode set to ${modeNumber} - ${
        modeNumber === 1
          ? "regisration mode"
          : modeNumber === 2
          ? "verification mode"
          : modeNumber === 3
          ? "delete a user mode"
          : modeNumber === 4
          ? "delete all users mode"
          : "locked mode"
      }`,
      data: {
        mode_id: modeNumber,
      },
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "failed to retrieve mode, setting device to lock mode",
      data: {
        mode_id: 10,
      },
    });
  }
});
module.exports = router;
