var express = require('express');
var userController = require ("../controllers/userControllers");
var authenticateToken = require ("../middlewares/auth");

const router = express.Router();

router.route("/user/register").post(userController.createUserControllerFunc);
router.route("/user/login").post(userController.loginUserControllerFunc);
router.route("/protected").get(authenticateToken, (req, res) => {
    res.status(200).send({ status: true, message: "Protected route accessed", user: req.user });
})

module.exports = router;