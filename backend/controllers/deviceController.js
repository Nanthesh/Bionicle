
const Device = require('../models/addDevice');

const addDevice = async (req, res) => {
  const { deviceName, modelNumber, voltage, deviceType } = req.body;
  const user_id = req.user.id;  // Obtain userName from JWT
  console.log("user_id:",user_id)
  try {
    const newDevice = new Device({
      deviceName,
      modelNumber,
      voltage,
      deviceType,
      user_id,
    });

    await newDevice.save();
    res.status(201).json({ message: 'Device added successfully', device: newDevice });
  } catch (error) {
    res.status(500).json({ message: 'Error adding device', error: error.message });
  }
};

const getDevices = async (req, res) => {
  try {
    const user_id = req.user.id;
    const devices = await Device.find({ user_id });
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
};

const editDevice = async (req, res) => {
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
};
const removeDevice = async (req, res) => {
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
};

module.exports = {
  addDevice,
  getDevices,
  editDevice,
  removeDevice
};
