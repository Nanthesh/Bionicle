import React, { useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../components/styles.css'

function DeviceManagementPage() {
  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({ title: '', category: '', description: '', powerConsumption: '', quantity: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingDeviceId, setEditingDeviceId] = useState(null);

  // Simulate fetching pre-added devices from backend
  useEffect(() => {
    const initialDevices = [
      { id: 1, name: 'Device 1', title: 'Smart Bulb', quantity: 10, powerConsumption: '15W', category: 'Lighting', description: 'WiFi-enabled smart bulb' },
      { id: 2, name: 'Device 2', title: 'Smart Thermostat', quantity: 5, powerConsumption: '5W', category: 'Heating', description: 'Automated home thermostat' },
      { id: 3, name: 'Device 3', title: 'Smart Lock', quantity: 3, powerConsumption: '7W', category: 'Security', description: 'Bluetooth-enabled lock' },
      { id: 3, name: 'Device 4', title: 'Smart Bell', quantity: 6, powerConsumption: '7W', category: 'Security', description: 'Bluetooth-enabled lock' },
    ];
    setDevices(initialDevices);
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Start editing a device
  const startEditing = (device) => {
    setIsEditing(true);
    setEditingDeviceId(device.id);
    setFormData({
      title: device.title,
      category: device.category,
      description: device.description,
      powerConsumption: device.powerConsumption,
      quantity: device.quantity,
    });
  };

  // Update the device details
  const updateDevice = () => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === editingDeviceId
          ? { ...device, title: formData.title, category: formData.category, description: formData.description, powerConsumption: formData.powerConsumption, quantity: formData.quantity }
          : device
      )
    );
    toast.dismiss(); // Clear any previous notifications
    toast.success('Device updated successfully!', {
      position: "top-center",
      autoClose: 2000, // Display for 2 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "colored",
      transition: Bounce
    });
    resetForm();
  };

  // Delete a device
  const deleteDevice = (id) => {
    setDevices((prev) => prev.filter((device) => device.id !== id));
    toast.dismiss(); // Clear any previous notifications
    toast.error('Device deleted successfully!', {
      position: "top-center",
      autoClose: 2000, // Display for 2 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "colored",
      transition: Bounce
    });
  };

  // Reset form and exit editing mode
  const resetForm = () => {
    setFormData({ title: '', category: '', description: '', powerConsumption: '', quantity: '' });
    setIsEditing(false);
    setEditingDeviceId(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Device Management</h2>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Editing Section Popup */}
      {isEditing && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '15px', background: '#f0f0f0', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
          <h3>Edit Device</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              name="title"
              placeholder="Device Title"
              value={formData.title}
              onChange={handleChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="text"
              name="category"
              placeholder="Device Category"
              value={formData.category}
              onChange={handleChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="text"
              name="description"
              placeholder="Device Description"
              value={formData.description}
              onChange={handleChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="text"
              name="powerConsumption"
              placeholder="Power Consumption (e.g., 10W)"
              value={formData.powerConsumption}
              onChange={handleChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <button
              onClick={updateDevice}
              style={{ padding: '10px', borderRadius: '4px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Update Device
            </button>
            <button
              onClick={resetForm}
              style={{ padding: '10px', borderRadius: '4px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Devices List */}
      <h3>Device List</h3>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        justifyContent: devices.length === 1 ? 'flex-start' : 'center'
      }}>
        {devices.map((device) => (
          <div key={device.id} style={{
            flex: '1 1 45%',
            minWidth: '250px',
            maxWidth: '400px',
            marginBottom: '15px',
            padding: '15px',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxSizing: 'border-box',
            textAlign: 'center'
          }}>
            <p><strong>Name:</strong> {device.name}</p>
            <p><strong>Title:</strong> {device.title}</p>
            <p><strong>Quantity:</strong> {device.quantity}</p>
            <p><strong>Power Consumption:</strong> {device.powerConsumption}</p>
            <p><strong>Category:</strong> {device.category}</p>
            <p><strong>Description:</strong> {device.description}</p>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => startEditing(device)}
                style={{ padding: '8px', borderRadius: '4px', background: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteDevice(device.id)}
                style={{ padding: '8px', borderRadius: '4px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeviceManagementPage;
