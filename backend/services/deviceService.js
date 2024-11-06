// services/deviceService.js
const Device = require('../models/addDevice');

const getAllDevices = async () => {
  return await Device.find({});
};

const updateDevice = async (id, data) => {
  return await Device.findByIdAndUpdate(id, data, { new: true });
};

const deleteDevice = async (id) => {
  return await Device.findByIdAndDelete(id);
};

module.exports = {
  getAllDevices,
  updateDevice,
  deleteDevice
};
