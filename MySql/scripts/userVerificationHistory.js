const db = require("../config/create_connection");

async function UserVerificationHistory({ response, matric_number }) {
  try {
    db.connect(async (err) => {
      if (err) {
        response.status(404).send({
          success: false,
          message:
            "could not establish a connection with database, please try again later",
        });
      }
      db.query(
        `SELECT * FROM verified_users WHERE matric_number = ?`,
        [matric_number.toLowerCase()],
        (err, result) => {
          if (err) {
            response.status(200).send({
              success: false,
              message: `Could not retrieve history`,
              data: [],
            });
          }
          response.status(200).send({
            success: true,
            message: `Student with Matric Number: ${matric_number} was verification history successfully retrieved`,
            data: result,
          });
        }
      );
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: "Ooops! Sorry, something went wrong.",
      data: error,
    });
  }
}
exports.UserVerificationHistory = UserVerificationHistory;
