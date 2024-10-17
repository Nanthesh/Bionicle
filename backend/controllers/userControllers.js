const userService = require("../services/userServices");

const createUserControllerFunc = async (req, res) => {
  try {
    console.log(req.body);

    // Call the service to create the user in the database
    const result = await userService.createUserDBService(req.body);

    console.log(result);
    console.log("****************");

    if (result.status) {
      console.log("Sending response with success");
      res.status(200).send({
        status: true,
        message: "User registered successfully",
        token: result.token,
        
      });
    } else {
      console.log("Sending error response");
      res.status(400).send({
        status: false,
        message: "Error creating user",
      });
    }
    console.log("Token", token);
    
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
