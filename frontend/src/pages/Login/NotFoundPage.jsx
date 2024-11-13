import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" color="error">404 - Page Not Found</Typography>
      <Typography variant="body1">The page you are looking for does not exist.</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
