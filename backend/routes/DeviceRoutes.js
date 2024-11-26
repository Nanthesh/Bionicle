const express = require('express');
const router = express.Router();
const { addDevice, getDevices, editDevice, removeDevice } = require('../controllers/deviceController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Add a device
router.post('/', authMiddleware, addDevice);

// Get all devices for the authenticated user
router.get('/', authMiddleware, getDevices);

// Update a device
router.put('/:id', authMiddleware, editDevice);

// Delete a device
router.delete('/:id', authMiddleware, removeDevice);

module.exports = router;

