const express = require("express");
const fs = require("fs");
const {
  LecturerLogin,
} = require("../../MySql/scripts/lecturer/login_lecturer");
const { CreateCourse } = require("../../MySql/scripts/lecturer/create_course");
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
  const { course_code, students } = req.body;
  if ((course_code, students)) {
    CreateCourse({ course_code, response: res, students: students });
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
});

module.exports = router;
