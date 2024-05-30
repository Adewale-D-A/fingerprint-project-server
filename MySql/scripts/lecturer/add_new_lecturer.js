const db = require("../../config/create_connection");

async function RegisterLecturer({
  response,
  firstname,
  lastname,
  title,
  email,
  username,
  password,
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
          `INSERT INTO lecturers (firstname, lastname,title, email, password, username) VALUES (?, ?, ?, ?, ?, ?, ? );`,
          [
            firstname.toLowerCase(),
            lastname.toLowerCase(),
            title.toLowerCase(),
            email.toLowerCase(),
            password,
            username.toLowerCase(),
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
                message: "lecturer registered successfully",
                data: {
                  firstname: firstname,
                  lastname: lastname,
                  title: title,
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
exports.RegisterLecturer = RegisterLecturer;
