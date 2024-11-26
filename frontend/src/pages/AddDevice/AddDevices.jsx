import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "../../components/Navbar";
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddDevice = () => {
  const [deviceName, setDeviceName] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [voltage, setVoltage] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const addDeviceName = (e) => setDeviceName(e.target.value);
  const addModelNumber = (e) => setModelNumber(e.target.value);
  const addVoltage = (e) => setVoltage(e.target.value);
  const addDeviceType = (e) => setDeviceType(e.target.value);

  const handleDevice = async () => {
    try {
        const token = sessionStorage.getItem('token'); // Assuming token is stored in sessionStorage

        if (!token) {
          console.error('Authorization token is missing');
          return; // Early exit if no token is available
        }
        const response = await axios.post(
            'http://localhost:4000/api/devices',
            {
              deviceName,
              deviceType,
              modelNumber,
              voltage,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Add token in Authorization header
              },
            }
          );
      console.log('Device added successfully:', response.data);
      toast.success('Device added successfully!');
      setDeviceName('');
      setDeviceType('');
      setModelNumber('');
      setVoltage('');
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error(
        error.response?.data?.message || 'An error occurred while adding the device.'
      );
      
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
   <ToastContainer />
      {/* Navbar */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, width: '100%' }}>
        <Navbar />
      </Box>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Main Content */}
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                marginLeft: isSidebarOpen ? { xs: 0, sm: '50px' } : '5px', // Reduced left margin for more left alignment
                padding: { xs: 2, sm: 4 },
                transition: 'margin 0.3s ease',
            }}
            >
          <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Add Device
              </Typography>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Device Name"
                  variant="outlined"
                  value={deviceName}
                  onChange={addDeviceName}
                  required
                />
                <TextField
                  label="Model number"
                  variant="outlined"
                  value={modelNumber}
                  onChange={addModelNumber}
                />
                <TextField
                  label="Voltage Produced"
                  variant="outlined"
                  type="number"
                  value={voltage}
                  onChange={addVoltage}
                />
                <TextField
                  label="Device Type"
                  variant="outlined"
                  value={deviceType}
                  onChange={addDeviceType}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDevice}
                  sx={{ mt: 2 }}
                >
                  Add Device
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default AddDevice;
