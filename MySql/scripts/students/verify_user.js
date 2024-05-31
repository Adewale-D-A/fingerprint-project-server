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
        response.status(400).send({
          success: false,
          message: `Failed: ${err?.message}`,
          data: err,
        });
      } else {
        db.query(
          `INSERT INTO verified_users (user_table_id, matric_number) VALUES (?, ?);`,
          [Number(user_table_id), matric_number.toLowerCase()],
          (err, result) => {
            if (err) {
              response.status(400).send({
                success: false,
                message: `Failed: ${err?.message}`,
                data: err,
              });
            } else {
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
exports.VerifyUser = VerifyUser;
