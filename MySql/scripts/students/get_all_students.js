const db = require("../../config/create_connection");

async function RetrieveAllStudents({ response }) {
  try {
    db.connect((err) => {
      if (err) {
        console.log("could not establish a connection with database");
        res.status(404).send({
          success: false,
          message:
            "could not establish a connection with database, please try again later",
        });
      }
      db.query(`SELECT * FROM students`, (err, result) => {
        if (err) {
          response.status(400).send({
            success: false,
            message: "could not query database",
            data: err,
          });
        }
        response.status(200).send({
          success: true,
          message: "students successfully retrieved",
          data: {
            users: result,
          },
        });
      });
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: "Ooops! Sorry, something went wrong.",
      data: error,
    });
  }
}
exports.RetrieveAllStudents = RetrieveAllStudents;
