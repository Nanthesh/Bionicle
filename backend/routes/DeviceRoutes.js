const express = require('express');
const router = express.Router();
const Device = require('../models/addDevice'); 

router.post('/devices', async (req, res) => {
    const { deviceName, modelNumber, voltage, deviceType } = req.body;

    try {
        const newDevice = new Device({
            deviceName,
            modelNumber,
            voltage,
            deviceType
        });
        
        await newDevice.save();
        res.status(201).json({ message: 'Device added successfully', device: newDevice });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
module.exports = router;
