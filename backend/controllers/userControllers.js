const userService = require("../services/userServices");

const createUserControllerFunc = async (req, res) => {
  try {
    console.log(req.body);

    // Call the service to create the user in the database
    const status = await userService.createUserDBService(req.body);

    console.log(status);
    console.log("****************");

    if (status) {
      res.status(200).send({
        status: true,
        message: "User registered successfully",
      });
    } else {
      res.status(400).send({
        status: false,
        message: "Error creating user",
      });
    }
  } catch (err) {
    console.log(err);

    // Send error response to client
    res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};

//  export the function
module.exports = {
  createUserControllerFunc,
};
