const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config/index");

const VerifyToken = ({ token }) => {
  const verify = jwt.verify(token, jwtSecretKey);
  return verify;
};

exports.VerifyToken = VerifyToken;
