const userService = require("../services/userServices");

module.exports.createUserControllerFunc = async (req, res) => {
  try {
    const userDetails = req.body;
    const result = await userService.createUserDBService(userDetails);

    if (result.status) {
      // Send response only once
      console.log("Sending response with success");
      return res.status(200).json({
        status: true,
        message: result.message,
        token: result.token, // Return the token
      });
    } else {
      // Handle failure scenario
      return res.status(400).json({
        status: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
