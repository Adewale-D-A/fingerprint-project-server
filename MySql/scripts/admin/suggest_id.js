const db = require("../../config/create_connection");

async function SuggestId({ response }) {
  try {
    db.connect((err) => {
      if (err) {
        response.status(400).send({
          success: false,
          message: `Failed: ${err?.message}`,
          data: err,
        });
      } else {
        db.query(`SELECT * FROM suggest_id WHERE id = 1`, (err, result) => {
          if (err) {
            response.status(400).send({
              success: false,
              message: `Failed: ${err?.message}`,
              data: err,
            });
          } else {
            if (result.length > 0) {
              const { suggest_id, id, timestamp, previous_id, status } =
                result[0];
              response.status(200).send({
                success: true,
                message: `returning suggested ID in data ${suggest_id}`,
                data: {
                  suggested_id: suggest_id,
                  previous_id: previous_id,
                  status: status,
                },
              });
            } else {
              response.status(404).send({
                success: false,
                message: `Record ID which contains the suggested ID was not found in the database`,
                data: {
                  record_id: 1,
                  student_data: {
                    record_id: 1,
                  },
                },
              });
            }
          }
        });
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
exports.SuggestId = SuggestId;
