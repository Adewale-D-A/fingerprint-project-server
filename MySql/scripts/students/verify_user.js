const db = require("../../config/create_connection");

async function VerifyUser({
  response,
  user_table_id,
  matric_number,
  firstname,
  hardware_id,
}) {
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
        `INSERT INTO verified_users (user_table_id, matric_number) VALUES (?, ?);`,
        [Number(user_table_id), matric_number.toLowerCase()],
        (err, result) => {
          if (err) {
            response.status(200).send({
              success: false,
              message: `Student found but verification failed`,
              data: {
                verified_id: hardware_id,
                student_data: {
                  user_id: hardware_id,
                  student_name: firstname,
                  matric_no: "unverified",
                },
              },
            });
          }
          response.status(200).send({
            success: true,
            message: `Student name: ${firstname} with Matric Number: ${matric_number} was successfully verified`,
            data: {
              verified_id: hardware_id,
              student_data: {
                user_id: hardware_id,
                student_name: firstname,
                matric_no: matric_number,
              },
            },
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
exports.VerifyUser = VerifyUser;
