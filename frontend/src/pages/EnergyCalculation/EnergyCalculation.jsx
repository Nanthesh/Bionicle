import React, { useState, useEffect } from 'react';
import { TextField, Typography, Button, Container, Paper, Grid, Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';
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

  // Error and touched states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  const validateField = (name, value) => {
    let error = '';

    if (name === 'amps' || name === 'volts' || name === 'hoursPerDay' || name === 'costPerKwh') {
      if (!value) {
        error = 'This field is required.';
      } else if (!/^\d+(\.\d+)?$/.test(value)) {
        error = 'Only numeric values are allowed.';
      }
    }
    if (name === 'hoursPerDay') {
      if (!value) {
        error = 'This field is required.';
      } else if (!/^\d+$/.test(value)) {
        error = 'Only numeric values are allowed.';
      } else if (parseInt(value, 10) > 24) {
        error = 'Hours per day cannot exceed 24.';
      }
    }

    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update values
    if (name === 'amps') setAmps(value);
    if (name === 'volts') setVolts(value);
    if (name === 'hoursPerDay') setHoursPerDay(value);
    if (name === 'costPerKwh') setCostPerKwh(value);

    // Re-validate the field on change
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const calculateCost = async () => {
    const validationErrors = {
      amps: validateField('amps', amps),
      volts: validateField('volts', volts),
      hoursPerDay: validateField('hoursPerDay', hoursPerDay),
      costPerKwh: validateField('costPerKwh', costPerKwh),
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return; // Don't proceed if there are validation errors
    }

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
                    name="amps"
                    variant="outlined"
                    value={amps}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.amps)}
                    helperText={errors.amps}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Volts"
                    name="volts"
                    variant="outlined"
                    value={volts}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.volts)}
                    helperText={errors.volts}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Hours per Day"
                    name="hoursPerDay"
                    variant="outlined"
                    value={hoursPerDay}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.hoursPerDay)}
                    helperText={errors.hoursPerDay}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cost per kWh ($)"
                    name="costPerKwh"
                    variant="outlined"
                    value={costPerKwh}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.costPerKwh)}
                    helperText={errors.costPerKwh}
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
