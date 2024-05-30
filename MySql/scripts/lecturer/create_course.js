const db = require("../../config/create_connection");
const { AddCourseStudents } = require("./add_course_students");

function CreateCourse({ response, course_code, students }) {
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
          `CREATE TABLE ${course_code} (id INT NOT NULL AUTO_INCREMENT,matric_number VARCHAR(45) NOT NULL,fullname VARCHAR(100) NOT NULL,PRIMARY KEY (id),UNIQUE INDEX matric_number_UNIQUE (matric_number ASC) VISIBLE,UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE)`,
          (err, result) => {
            if (err) {
              response.status(400).send({
                success: false,
                message: `Failed: ${err?.message}`,
                data: err,
              });
            } else {
              AddCourseStudents({
                response: response,
                students: students,
                course_code: course_code,
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
exports.CreateCourse = CreateCourse;
