const Device = require('../models/energyCalculator');

// Save a new device to the database
const createDevice = async (req, res) => {
    const { deviceName, modelNumber, voltage, deviceType } = req.body;

    // Validate the input fields
    if (!deviceName || !modelNumber || !voltage || !deviceType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Create a new device instance and save it to the database
        const newDevice = new Device({ deviceName, modelNumber, voltage, deviceType });
        await newDevice.save();

        // Send a success response
        res.status(201).json({ message: 'Device created successfully', device: newDevice });
    } catch (error) {
        // Handle any errors that occur during saving
        res.status(500).json({ message: 'Error creating device', error: error.message });
    }
};

module.exports = {
    createDevice
};
