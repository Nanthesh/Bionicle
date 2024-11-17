import React, { useState, useEffect } from 'react';
import { TextField, Typography, Button, Container, Paper, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const EnergyCalculation = () => {
  const [amps, setAmps] = useState('');
  const [volts, setVolts] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [costPerKwh, setCostPerKwh] = useState('');
  const [dailyCost, setDailyCost] = useState(null);
  const [monthlyCost, setMonthlyCost] = useState(null);
  const [devices, setDevices] = useState([]); // State for the list of devices
  const [selectedDevice, setSelectedDevice] = useState(''); // State for the selected device

  // Fetch devices when the component mounts
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/devices');
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  const handleDeviceSelection = (event) => {
    const selected = devices.find(device => device.deviceName === event.target.value);
    if (selected) {
      setAmps(selected.amps || ''); // Ensure you have an 'amps' property in your backend data
      setVolts(selected.voltage || ''); // Using 'voltage' from the backend data
      setSelectedDevice(event.target.value);
    }
  };

  const calculateCost = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/calculate-energy', {
        amps,
        voltage: volts,
        hoursPerDay,
        costPerKwh,
      });

      if (response.status === 200) {
        setDailyCost((response.data.totalCost / 30).toFixed(2)); // Assuming the backend sends monthly cost, split to get daily cost
        setMonthlyCost(response.data.totalCost);
      }
    } catch (error) {
      console.error('Error calculating cost:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <Grid container>
        <Grid item xs={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={10}>
          <Container maxWidth="sm" style={{ marginTop: '30px', marginBottom: '30px' }}>
            <Paper
              elevation={3}
              sx={{
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Electricity Cost Calculator
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                    <InputLabel id="device-select-label">Select Device</InputLabel>
                    <Select
                      labelId="device-select-label"
                      value={selectedDevice}
                      onChange={handleDeviceSelection}
                      label="Select Device"
                    >
                      {devices.map((device, index) => (
                        <MenuItem key={index} value={device.deviceName}>
                          {device.deviceName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amps"
                    variant="outlined"
                    value={amps}
                    onChange={(e) => setAmps(e.target.value)}
                    type="number"
                    sx={{ marginBottom: '10px' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Volts"
                    variant="outlined"
                    value={volts}
                    onChange={(e) => setVolts(e.target.value)}
                    type="number"
                    sx={{ marginBottom: '10px' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Hours per Day"
                    variant="outlined"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(e.target.value)}
                    type="number"
                    sx={{ marginBottom: '10px' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cost per kWh ($)"
                    variant="outlined"
                    value={costPerKwh}
                    onChange={(e) => setCostPerKwh(e.target.value)}
                    type="number"
                    placeholder="e.g., 0.10"
                    sx={{ marginBottom: '10px' }}
                  />
                </Grid>
                <Grid item xs={12} align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={calculateCost}
                    sx={{
                      padding: '10px 20px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    Calculate
                  </Button>
                </Grid>
                {dailyCost !== null && (
                  <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
                    <Typography variant="h6" color="secondary">
                      Daily Cost: ${dailyCost}
                    </Typography>
                    <Typography variant="h6" color="secondary">
                      Monthly Cost: ${monthlyCost}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

export default EnergyCalculation;
