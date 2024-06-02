const db = require("../../config/create_connection");

async function AttendanceHistory({ response, start_date_time, end_date_time }) {
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
          `SELECT * FROM verified_users WHERE timestamp between '${start_date_time}' and '${end_date_time}' 
            order by timestamp desc;`,
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
