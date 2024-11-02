import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../components/AuthProvider';

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <Navbar />

        {/* Dashboard Content */}
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Energy Savings Tips
          </Typography>
          <Grid container spacing={2}>
            {["Use LED Bulbs", "Unplug Devices", "Seal Windows", "Use Smart Thermostat"].map((tip, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card 
                  sx={{ 
                    boxShadow: 2, // Slightly reduced shadow
                    borderRadius: 2, 
                    transition: '0.3s', 
                    '&:hover': { transform: 'scale(1.03)', boxShadow: 4 }, // Slightly reduced hover scale
                    padding: 1.5, // Reduced padding for a smaller card
                    minHeight: 180 // Reduced minimum height
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.25rem' }}>
                      {tip}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                      {index === 0 ? "Switching to LED bulbs can save up to 80% of energy compared to traditional bulbs." : 
                        index === 1 ? "Unplugging devices when not in use prevents phantom energy loss." : 
                        index === 2 ? "Sealing windows helps maintain your home’s temperature and reduces energy use." : 
                        "Smart thermostats optimize heating and cooling schedules to save energy."}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
