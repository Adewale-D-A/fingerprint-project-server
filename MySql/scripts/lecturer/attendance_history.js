const db = require("../../config/create_connection");

async function AttendanceHistory({
  response,
  course_code,
  start_date_time,
  end_date_time,
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
          `SELECT MIN(verified_users.id) as id, MIN(user_table_id) as user_table_id, MIN(verified_users.matric_number) as matric_number, MIN(timestamp) as timestamp, MIN(fullname) as fullname FROM verified_users JOIN ${course_code} ON verified_users.matric_number = ${course_code}.matric_number WHERE timestamp between '${start_date_time}' and '${end_date_time}' group by verified_users.matric_number order by MIN(verified_users.timestamp) desc;`,
          (err, result) => {
            if (err) {
              response.status(400).send({
                success: false,
                message: `Failed: ${err?.message}`,
                data: err,
              });
            } else {
              console.log({ result });
              response.status(200).send({
                success: true,
                message: "History successfully retrieved",
                data: result,
              });
            }
          }
        );
      }
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: "Ooops! Sorry, something went wrong.",
      data: error,
    });
  }
}
exports.AttendanceHistory = AttendanceHistory;
