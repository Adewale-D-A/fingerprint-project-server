const { AuthenticateUser } = require("../../../JWT/authentication");
const db = require("../../config/create_connection");

function LecturerLogin({ response, email, password }) {
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
          `SELECT * FROM lecturers WHERE email = ?`,
          [email],
          (err, result) => {
            if (err) {
              response.status(400).send({
                success: false,
                message: `Failed: ${err?.message}`,
                data: err,
              });
            } else {
              if (result[0]) {
                const user_data = result[0];
                if (user_data.password === password) {
                  lecturer_profile = {
                    firstname: user_data?.firstname,
                    lastname: user_data?.lastname,
                    title: user_data?.title,
                    courses: user_data?.courses?.replace(/\s/g, "")?.split(","), // object of courses
                    username: user_data?.username,
                    email: user_data?.email,
                    role: "lecturer",
                    created_at: user_data?.created_at,
                  };
                  const acessToken = AuthenticateUser({
                    jsonPayload: lecturer_profile,
                  });
                  response.status(200).send({
                    success: true,
                    message: "lecturer login was successful",
                    data: {
                      access_token: acessToken,
                      firstname: user_data.firstname,
                      email: user_data?.email,
                      user: lecturer_profile,
                    },
                  });
                } else {
                  response.status(404).send({
                    success: false,
                    message: "Invalid login credentials",
                  });
                }
              } else {
                response.status(404).send({
                  success: false,
                  message: "Invalid login credentials",
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
exports.LecturerLogin = LecturerLogin;
