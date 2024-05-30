const express = require("express");
const fs = require("fs");
const {
  LecturerLogin,
} = require("../../MySql/scripts/lecturer/login_lecturer");
const { CreateCourse } = require("../../MySql/scripts/lecturer/create_course");
const { VerifyToken } = require("../../JWT/verification");
const router = express.Router();

//POST REQUESTS
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    LecturerLogin({ email, password, response: res });
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

//POST REQUESTS
router.post("/register-course", (req, res) => {
  const requestToken = req.get("Authorization")?.split(" ")[1];
  const { course_code, students } = req.body;
  try {
    if (requestToken) {
      if ((course_code, students)) {
        const decoded = VerifyToken({ token: requestToken });

        CreateCourse({
          course_code,
          response: res,
          students: students,
          auth_user: decoded,
        });
      } else {
        res.status(406).json({
          success: false,
          layer: "no course code",
          message: "bad request body",
          payload_structure: {
            course_code: "required*",
            students: "requred*",
          },
        });
      }
    } else {
      res.status(401).send({
        success: false,
        message: "Unauthorized",
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

module.exports = router;
