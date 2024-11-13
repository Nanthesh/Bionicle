import React, { useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../components/styles.css';
import Sidebar from '../../components/Sidebar.jsx';
import PrimarySearchAppBar from '../../components/Navbar.jsx';


function DeviceManagementPage() {
  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({ title: '', category: '', description: '', powerConsumption: '', quantity: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingDeviceId, setEditingDeviceId] = useState(null);

  // Authorization header
  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/devices', { headers })
      .then(response => response.json())
      .then(data => setDevices(data))
      .catch(error => console.error('Error fetching devices:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = (device) => {
    setIsEditing(true);
    setEditingDeviceId(device._id);
    setFormData({
      title: device.deviceName,
      category: device.deviceType,
      description: device.modelNumber,
      powerConsumption: device.voltage,
      quantity: device.quantity || '',
    });
  };

  const updateDevice = () => {
    fetch(`http://localhost:4000/api/devices/${editingDeviceId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...headers // Include the authorization header here
      },
      body: JSON.stringify({
        deviceName: formData.title,
        modelNumber: formData.description,
        voltage: formData.powerConsumption,
        deviceType: formData.category,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setDevices(prev => prev.map(device => device._id === editingDeviceId ? data.device : device));
        toast.success('Device updated successfully!', {
          position: "top-center",
          autoClose: 1000,
          theme: "colored",
          transition: Bounce,
        });
        resetForm();
      })
      .catch(error => console.error('Error updating device:', error));
  };

  const deleteDevice = (id) => {
    const confirmationToast = toast.info(
      <div>
        <p>Are you sure you want to delete this device?</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => {
              toast.dismiss(confirmationToast);
              handleDelete(id);
            }}
            style={{
              padding: '5px 10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(confirmationToast)}
            style={{
              padding: '5px 10px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: "colored",
      }
    );
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/api/devices/${id}`, {
      method: 'DELETE',
      headers,
    })
      .then(response => response.json())
      .then(() => {
        setDevices(prev => prev.filter(device => device._id !== id));
        toast.success('Device deleted successfully!', {
          position: "top-center",
          autoClose: 1000,
          theme: "colored",
          transition: Bounce,
        });
      })
      .catch(error => {
        console.error('Error deleting device:', error);
        toast.error('Error deleting device.', {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
          transition: Bounce,
        });
      });
  };

  const resetForm = () => {
    setFormData({ title: '', category: '', description: '', powerConsumption: '', });
    setIsEditing(false);
    setEditingDeviceId(null);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar/> {/* Render the Sidebar */} 
      <div style={{ flexGrow: 1 }}>
        <PrimarySearchAppBar /> {/* Render the Navbar */}
        <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
          <h2 style={{ textAlign: 'center', color: '#333' }}>Device Management</h2>

          <ToastContainer />

          {isEditing && (
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '15px', background: '#f0f0f0', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
              <h3>Edit Device</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" name="title" placeholder="Device Title" value={formData.title} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                <input type="text" name="category" placeholder="Device Category" value={formData.category} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                <input type="text" name="description" placeholder="Device Description" value={formData.description} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                <input type="text" name="powerConsumption" placeholder="Power Consumption (e.g., 10W)" value={formData.powerConsumption} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                <button onClick={updateDevice} style={{ padding: '10px', borderRadius: '4px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>Update Device</button>
                <button onClick={resetForm} style={{ padding: '10px', borderRadius: '4px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}

          <h3>Device List</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: devices.length === 1 ? 'flex-start' : 'center' }}>
            {devices.map((device) => (
              <div key={device._id} style={{ flex: '1 1 45%', minWidth: '250px', maxWidth: '400px', marginBottom: '15px', padding: '15px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', textAlign: 'center' }}>
                <p><strong>Name:</strong> {device.deviceName}</p>
                <p><strong>Voltage:</strong> {device.voltage}</p>
                <p><strong>Category:</strong> {device.deviceType}</p>
                <p><strong>Model Number:</strong> {device.modelNumber}</p>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button onClick={() => startEditing(device)} style={{ padding: '8px', borderRadius: '4px', background: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => deleteDevice(device._id)} style={{ padding: '8px', borderRadius: '4px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeviceManagementPage;
