// routes/deviceRoute.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const deviceController = require('../controllers/deviceController');

const router = express.Router();

router.get('/devices', authMiddleware, deviceController.getDevices);
router.put('/devices/:id', authMiddleware, deviceController.editDevice);
router.delete('/devices/:id', authMiddleware, deviceController.removeDevice);

module.exports = router;
