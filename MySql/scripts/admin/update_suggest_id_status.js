const db = require("../../config/create_connection");

async function ChangeSuggestIdStatus({ response, registered_id }) {
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
          `UPDATE suggest_id SET status = true, suggest_id = ${
            Number(registered_id) + 1
          } WHERE id = 1;`,
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
                message: `ID - ${registered_id} successfully registered`,
                data: {
                  registered_id: registered_id,
                  suggest_id_status: true,
                },
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
exports.ChangeSuggestIdStatus = ChangeSuggestIdStatus;
