const db = require("../../config/create_connection");

async function SearchMatricNumber({ matric_number, response }) {
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
          `SELECT * FROM students WHERE matric_number = ?`,
          [matric_number],
          (err, result) => {
            if (err) {
              response.status(400).send({
                success: false,
                message: `Failed: ${err?.message}`,
                data: err,
              });
            } else {
              if (result.length > 0) {
                const student_data = result;
                response.status(200).send({
                  success: true,
                  message: `Matric number ${matric_number} retrived successfully`,
                  data: student_data,
                });
              } else {
                response.status(404).send({
                  success: false,
                  message: `No student with this matric number found`,
                  data: {},
                });
              }
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
exports.SearchMatricNumber = SearchMatricNumber;
