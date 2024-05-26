const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config/index");

function AuthenticateUser({ jsonPayload }) {
  token = jwt.sign(jsonPayload, jwtSecretKey);
  return token;
}

exports.AuthenticateUser = AuthenticateUser;
