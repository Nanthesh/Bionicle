var express = require('express');
var userController = require("../controllers/userControllers");

const router = express.Router();

router.route("/user/register").post(userController.createUserControllerFunc);

module.exports = router;
