const express = require("express");
const fs = require("fs");
const {
  RetrieveAllStudents,
} = require("../../MySql/scripts/students/get_all_students");
const { RegisterUser } = require("../../MySql/scripts/students/add_new_user");
const {
  RegisterLecturer,
} = require("../../MySql/scripts/lecturer/add_new_lecturer");
const { RegisterAdmin } = require("../../MySql/scripts/admin/add_new_admin");
const { AdminLogin } = require("../../MySql/scripts/admin/login_admin");
const router = express.Router();

const registeredDB_url = "./files/registered.json";
const verifiedDB_url = "./files/verified.json";
const isToDeleteDB_url = "./files/idToDelete.json";
const purge_url = "./files/purgeState.json";
const mode_url = "./files//mode.json";

//TODO: Logic to get dynamic variables for total available and registered IDS
const total_available_ids = 543;
const total_registered_ids = 422;

//POST REQUESTS

// router.post("/login", (req, res) => {
//   const {email, password
//   } = req.body;

//   if (email && password) {
//     // console.log(req.cookies);
//     queryLoginCredentials(username_email, password, res);
//   } else {
//     res.status(406).json({
//       success: false,
//       layer: "no username or password",
//       message: "bad request body",
//       payload_structure: {
//         username_email: "required",
//         password: "required",
//       },
//     });
//   }
// });

router.post("/register-admins", (req, res) => {
  const { firstname, lastname, email, password, username, privilege } =
    req.body;

  try {
    if (firstname && lastname && email && password && username && privilege) {
      RegisterAdmin({
        response: res,
        firstname,
        lastname,
        privilege,
        email,
        username,
        password,
      });
    } else {
      res.status(404).send({
        success: false,
        message:
          "invalid request - firstname, lastname,email,username, priveledge and password are required",
        data: {
          firstname: "firstname*",
          lastname: "lastname",
          priviledge: "number*",
          email: "email",
          username: "username",
          password: "password*",
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
});
router.post("/register-users", (req, res) => {
  const {
    firstname,
    lastname,
    matric_number,
    email,
    username,
    password,
    hardware_user_id,
  } = req.body;

  try {
    if (firstname && matric_number && password && hardware_user_id) {
      RegisterUser({
        response: res,
        firstname,
        lastname,
        matric_number,
        email,
        username,
        password,
        hardware_user_id,
      });
    } else {
      res.status(404).send({
        success: false,
        message:
          "invalid request - firstname, matric_number, hardware_user_id and password are required",
        data: {
          firstname: "firstname*",
          lastname: "lastname",
          matric_number: "matric number*",
          email: "email",
          username: "username",
          password: "password*",
          hardware_user_id: "hardware ID*",
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
});

router.post("/register-lecturers", (req, res) => {
  const { firstname, lastname, title, courses, email, password, username } =
    req.body;
  try {
    if (
      firstname &&
      lastname &&
      title &&
      courses &&
      email &&
      password &&
      username
    ) {
      RegisterLecturer({
        response: res,
        firstname,
        lastname,
        title,
        courses,
        email,
        password,
        username,
      });
    } else {
      res.status(404).send({
        success: false,
        message:
          "invalid request - firstname, lastname, courses, title and password are required",
        data: {
          firstname: "firstname*",
          lastname: "lastname",
          email: "email",
          username: "username",
          password: "password*",
          courses: {},
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
});

//Admin Login REQUESTS
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    AdminLogin({ email, password, response: res });
  } else {
    res.status(406).json({
      success: false,
      layer: "no username or password",
      message: "bad request body",
      payload_structure: {
        email: "required",
        password: "required",
      },
    });
  }
});

//HARDWARE REQUESTS
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
            ? "registration mode"
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

//GET REQUESTS
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

router.get("/all_students", (req, res) => {
  RetrieveAllStudents({ response: res });
});
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

module.exports = router;
