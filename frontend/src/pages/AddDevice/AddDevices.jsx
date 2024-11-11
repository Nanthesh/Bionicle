import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
const AddDevice = () => {

    const [deviceName, setDeviceName] = useState(' ');
    const [modelNumber, setModelNumber]= useState(' ');
    const [voltage, setVoltage]= useState('');
    const [deviceType, setDeviceType]= useState(' ');

    const addDeviceName = (e)=>
    {
        setDeviceName(e.target.value);
    };
    const addModelNumber = (e)=>
    {
        setModelNumber(e.target.value);
    };
    const addVoltage =(e)=>
    {
        setVoltage(e.target.value);
    };
    const addDeviceType =(e)=>
    {
        setDeviceType(e.target.value);
    };

  const handleDevice = async () => 
    {
        try
        {
            const response = await axios.post('http://localhost:4000/api/devices', {
                deviceName,
                deviceType,
                modelNumber,
                voltage
            });
            console.log('Device added successfully:', response.data);
            setDeviceName('');
            setDeviceType('');
            setModelNumber('');
            setVoltage('');
        } 
        catch (error) 
         {
              console.error('Error adding device:', error);
        }
    };
  return (
    <Container maxWidth="sm">
        <Box sx={{mt:4}}>
            <Typography variant='h4' component='h1' gutterBottom>
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
            variant='outlined'
            value={deviceType}
            onChange={addDeviceType}/>
            <Button
            variant='contained'
            color='primary'
            onClick={handleDevice}
            sx={{mt:2}}>
                Add Device
            </Button>
        </Box>
        </Box>
    </Container>
  )
};

export default AddDevice;