const express = require('express');
const userController = require('../controllers/userControllers');

const router = express.Router();

// Register route
router.post('/user/register', userController.createUserControllerFunc);

module.exports = router;
