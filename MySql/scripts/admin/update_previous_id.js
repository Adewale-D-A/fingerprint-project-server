const db = require("../../config/create_connection");

async function SyncPreviousId() {
  try {
    db.connect((err) => {
      if (!err) {
        db.query(`SELECT * FROM suggest_id WHERE id = 1`, (error, result) => {
          if (!error && result.length > 0) {
            const { suggest_id, id, timestamp, previous_id, status } =
              result[0];
            db.query(
              `UPDATE suggest_id SET status = false, previous_id = ${Number(
                suggest_id
              )} WHERE id = 1;`
            );
          }
        });
      }
    });
  } catch (error) {}
}
exports.SyncPreviousId = SyncPreviousId;
