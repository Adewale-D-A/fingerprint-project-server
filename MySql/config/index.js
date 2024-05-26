require("dotenv").config();

const secret_data = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  name: process.env.MYSQL_NAME,
};

exports.secret_data = secret_data;
