const { AuthenticateUser } = require("../../../JWT/authentication");
const db = require("../../config/create_connection");

function UserLogin({ response, matric_number, password }) {
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
          `SELECT * FROM students WHERE matric_number = ?`,
          [matric_number],
          (err, result) => {
            if (err) {
              response.status(400).send({
                success: false,
                message: "could not query database",
                data: err,
              });
            } else {
              if (result[0]) {
                const user_data = result[0];
                if (user_data.password === password) {
                  user_profile = {
                    firstname: user_data?.firstname,
                    lastname: user_data?.lastname,
                    matric_number: user_data?.matric_number,
                    username: user_data?.username,
                    email: user_data?.email,
                    hardware_user_id: user_data?.username,
                    role: "student",
                  };
                  const acessToken = AuthenticateUser({
                    jsonPayload: user_profile,
                  });
                  response.status(200).send({
                    success: true,
                    message: "user login was successful",
                    data: {
                      access_token: acessToken,
                      matric_number: user_data.matric_number,
                      hardware_user_id: user_data?.username,
                      user: user_profile,
                    },
                  });
                } else {
                  response.status(404).send({
                    success: false,
                    message: "user does not exist",
                  });
                }
              } else {
                response.status(404).send({
                  success: false,
                  message: "user does not exist",
                });
              }
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
exports.UserLogin = UserLogin;
