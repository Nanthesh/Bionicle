const express = require('express');
const { getUserName } = require('../controllers/userController');

const router = express.Router();

// Route to get a user's username by ID
router.get('/:id/username', getUserName);

module.exports = router;
