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

    router.get('/devices', async (req,res)=>
    {
        try{
            const devices= await Device.find();
            res.status(200).json(devices);
        }
        catch (error){
            res.status(500).json({ message: 'Error fetching devices', error: error.message });
        }
    });
    router.put('/devices/:id', async (req, res) => {
        const { id } = req.params;
        const { deviceName, modelNumber, voltage, deviceType } = req.body;
    
        try {
            const updatedDevice = await Device.findByIdAndUpdate(
                id,
                { deviceName, modelNumber, voltage, deviceType },
                { new: true }
            );
    
            if (!updatedDevice) {
                return res.status(404).json({ message: 'Device not found' });
            }
    
            res.status(200).json({ message: 'Device updated successfully', device: updatedDevice });
        } catch (error) {
            res.status(500).json({ message: 'Error updating device', error: error.message });
        }
    });
    // Delete a device
    router.delete('/devices/:id', async (req, res) => {
        const { id } = req.params;
    
        try {
            const deletedDevice = await Device.findByIdAndDelete(id);
            if (!deletedDevice) {
                return res.status(404).json({ message: 'Device not found' });
            }
    
            res.status(200).json({ message: 'Device deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting device', error: error.message });
        }
    });

module.exports = router;
