const db = require("../../config/create_connection");

async function RegisterAdmin({
  response,
  firstname,
  lastname,
  email,
  password,
  username,
  privilege,
}) {
  try {
    db.connect((err) => {
      if (err) {
        response.status(400).send({
          success: false,
          message: `Failed: ${err?.message}`,
          data: err,
        });
      } else {
        db.query(
          `INSERT INTO admins (firstname, lastname,email, password, username, privilege) VALUES (?, ?, ?, ?, ?, ? );`,
          [
            firstname.toLowerCase(),
            lastname.toLowerCase(),
            email.toLowerCase(),
            password,
            username.toLowerCase(),
            privilege,
          ],
          (err, result) => {
            if (err) {
              response.status(400).send({
                success: false,
                message: `Failed: ${err?.message}`,
                data: err,
              });
            } else {
              response.status(201).send({
                success: true,
                message: "admin registered successfully",
                data: {
                  firstname: firstname,
                  lastname: lastname,
                  priviledge: privilege,
                  email: email,
                  username: username,
                },
              });
            }
          }
        );
      }
    });
  } catch (error) {
    response.status(400).send({
      success: false,
      message: "Ooops! Something went wrong, please try again later",
      data: error,
    });
  }
}
exports.RegisterAdmin = RegisterAdmin;
