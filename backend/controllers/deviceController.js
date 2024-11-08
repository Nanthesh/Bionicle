// controllers/deviceController.js
const { getAllDevices, updateDevice, deleteDevice } = require('../services/deviceService');

const getDevices = async (req, res) => {
  try {
    const devices = await getAllDevices();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
};

const editDevice = async (req, res) => {
  try {
    const updatedDevice = await updateDevice(req.params.id, req.body);
    res.status(200).json({ message: 'Device updated', device: updatedDevice });
  } catch (error) {
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
};

const removeDevice = async (req, res) => {
  try {
    await deleteDevice(req.params.id);
    res.status(200).json({ message: 'Device deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting device', error: error.message });
  }
};

module.exports = {
  getDevices,
  editDevice,
  removeDevice
};
