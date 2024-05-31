const express = require("express");
const fs = require("fs");
const { VerifyToken } = require("../../JWT/verification");
const { UserLogin } = require("../../MySql/scripts/students/login_user");
const {
  UserVerificationHistory,
} = require("../../MySql/scripts/students/userVerificationHistory");
const router = express.Router();

//POST REQUESTS
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const matric_number = email ? email.split("@")[0] : null;
  if (matric_number && password) {
    UserLogin({ matric_number, password, response: res });
  } else {
    res.status(406).json({
      success: false,
      layer: "no username or password",
      message: "bad request body",
      payload_structure: {
        username_email: "required",
        password: "required",
      },
    });
  }
});

router.get("/verification-history", (req, res) => {
  const requestToken = req.get("Authorization")?.split(" ")[1];

  try {
    if (!requestToken) {
      res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }
    const decoded = VerifyToken({ token: requestToken });
    UserVerificationHistory({
      response: res,
      matric_number: decoded?.matric_number,
    });
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
