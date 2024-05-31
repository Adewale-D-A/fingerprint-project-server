const db = require("../../config/create_connection");

async function ChangeSuggestId({ response, next_suggest_id }) {
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
          `UPDATE suggest_id SET suggest_id = ${next_suggest_id} WHERE id = 1;`,
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
                message: `Next suggested ID updated to - ${next_suggest_id}`,
                data: {
                  next_suggest_id,
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
exports.ChangeSuggestId = ChangeSuggestId;
