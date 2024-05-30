const db = require("../../config/create_connection");

async function AddCourseStudents({ response, students, course_code }) {
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
          `INSERT INTO ${course_code} (matric_number, fullname) VALUES (?)`,
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
exports.AddCourseStudents = AddCourseStudents;
