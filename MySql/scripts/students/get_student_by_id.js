const db = require("../../config/create_connection");
const { VerifyUser } = require("./verify_user");

async function RetrieveStudentById({ response, hardware_id }) {
  try {
    db.connect((err) => {
      if (err) {
        res.status(404).send({
          success: false,
          message:
            "could not establish a connection with database, please try again later",
        });
      }
      db.query(
        `SELECT * FROM students WHERE hardware_user_id = ?`,
        [hardware_id],
        (err, result) => {
          if (err) {
            response.status(400).send({
              success: false,
              message: "could not query database",
              data: err,
            });
          }
          if (result.length > 0) {
            const { firstname, matric_number, hardware_user_id, student_id } =
              result[0];
            VerifyUser({
              response: response,
              firstname,
              hardware_id: hardware_user_id,
              user_table_id: student_id,
              matric_number,
            });
          } else {
            response.status(200).send({
              success: false,
              message: `Student with hardware id: ${hardware_id} was not found`,
              data: {
                verified_id: hardware_id,
                student_data: {
                  user_id: hardware_id,
                  student_name: "N/A",
                  matric_no: "not registered",
                },
              },
            });
          }
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
exports.RetrieveStudentById = RetrieveStudentById;
