import React, { useState } from 'react';
import { TextField, Typography, Button, Container, Paper, Grid } from '@mui/material';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const EnergyCalculation = () => {
  const [amps, setAmps] = useState('');
  const [volts, setVolts] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [costPerKwh, setCostPerKwh] = useState('');
  const [dailyCost, setDailyCost] = useState(null);
  const [monthlyCost, setMonthlyCost] = useState(null);

  const calculateCost = () => {
    const watts = amps * volts;
    const dailyConsumption = (watts * hoursPerDay) / 1000; // kWh per day
    const dailyCostCalc = dailyConsumption * costPerKwh;
    const monthlyCostCalc = dailyCostCalc * 30;

    setDailyCost(dailyCostCalc.toFixed(2));
    setMonthlyCost(monthlyCostCalc.toFixed(2));
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
