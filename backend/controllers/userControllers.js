const userService = require("../services/userServices");

const createUserControllerFunc = async (req, res) => {
  try {
    console.log(req.body);

    // Call the service to create the user in the database
    const result = await userService.createUserDBService(req.body);

    console.log(result);
    console.log("****************");

    if (result) {
      res.status(200).send({
        status: true,
        message: "User registered successfully",
        token: result.token,
        
      });
    } else {
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

const loginUserControllerFunc = async (req, res) => {
    try {
        const result = await userService.loginUserDBService(req.body.email, req.body.password);
        res.status(200).send({
            status: true,
            message: "User logged in successfully",
            token: result.token
        });
    } catch (error) {
        res.status(400).send({ status: false, message: error.message });
    }
};

//  export the function
module.exports = {
  createUserControllerFunc,
  loginUserControllerFunc
};
