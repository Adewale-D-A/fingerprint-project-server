const mysql = require("mysql2");
const { secret_data } = require("./index");

module.exports = mysql.createConnection({
  host: secret_data.host,
  user: secret_data.user,
  password: secret_data.password,
  database: secret_data.name,
});
