const db = require("../../config/create_connection");
const { UpdateLecturerRecord } = require("./update_lecturer_record");

async function AddCourseStudents({
  response,
  students,
  course_code,
  auth_user,
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
          `INSERT INTO ${course_code} (matric_number, fullname) VALUES ?`,
          [
            students.map((student) => [
              student.matric_number,
              student.fullname,
            ]),
          ],
          (err, result) => {
            if (err) {
              response.status(400).send({
                success: false,
                message: `Failed: ${err?.message}`,
                data: err,
              });
            } else {
              UpdateLecturerRecord({ response, course_code, auth_user });
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
exports.AddCourseStudents = AddCourseStudents;
