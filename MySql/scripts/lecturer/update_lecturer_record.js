const db = require("../../config/create_connection");

async function UpdateLecturerRecord({ response, course_code, auth_user }) {
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
          `UPDATE lecturers SET courses = "${course_code}" WHERE email = "${auth_user?.email}";`,
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
                message: "students successfully added to course",
                data: {},
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
exports.UpdateLecturerRecord = UpdateLecturerRecord;
