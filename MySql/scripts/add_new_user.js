const db = require("../config/create_connection");

async function RegisterUser({
  response,
  firstname,
  lastname,
  matric_number,
  email,
  username,
  password,
  hardware_user_id,
}) {
  try {
    db.connect();
    const result = db.query(
      `INSERT INTO students (firstname, lastname,matric_number, email, username, hardware_user_id, password) VALUES (?, ?, ?, ?, ?, ?, ? );`,
      [
        firstname.toLowerCase(),
        lastname.toLowerCase(),
        matric_number.toLowerCase(),
        email.toLowerCase(),
        username.toLowerCase(),
        hardware_user_id,
        password,
      ]
    );
    if (result) {
      response.status(201).send({
        success: true,
        message: "user registered successfully",
        data: {
          firstname: firstname,
          lastname: lastname,
          matric_number: matric_number,
          email: email,
          username: username,
          hardware_user_id: hardware_user_id,
        },
      });
    }
  } catch (error) {
    response.status(400).send({
      success: false,
      message: "server could not query db",
      data: error,
    });
  }
}
exports.RegisterUser = RegisterUser;
