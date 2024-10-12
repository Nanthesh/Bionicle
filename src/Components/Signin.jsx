import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Link,
  Container,
  Box,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error handling
  const [showPassword, setShowPassword] = useState(false); 

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(''); // Clear error when the user types
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError(''); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Simple email validation 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return; 
    }

    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Login to EcosysTech
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Please enter your email and password to access your account.
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              placeholder="youremail@example.com" // placeholder text 
              value={email}
              onChange={handleEmailChange}
              error={Boolean(error)} // Set error prop
              helperText={error} // Display error message
              sx={{
                borderRadius: '50px',  // Rounded corners
                '& .MuiOutlinedInput-root': {
                  borderRadius: '50px', // Rounded corners for input
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1.1rem',  // Adjust font size for label
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#5D3FD3',  // Color of the border
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4b2fc4',  // Hover color of the border
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#5D3FD3',  // Focus color of the border
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password" // Add placeholder text here
              value={password}
              onChange={handlePasswordChange}
              sx={{
                borderRadius: '50px',  // Rounded corners
                '& .MuiOutlinedInput-root': {
                  borderRadius: '50px', // Rounded corners for input
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1.1rem',  // Adjust font size for label
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#5D3FD3',  // Color of the border
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4b2fc4',  // Hover color of the border
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#5D3FD3',  // Focus color of the border
                },
              }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handlePasswordVisibility}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#5D3FD3',
                  borderRadius: '50px', // Rounded edges
                  paddingX: 4, // Horizontal padding
                  paddingY: 1,  // Vertical padding
                  ':hover': {
                    backgroundColor: '#4b2fc4', // Hover color
                  },
                }}
              >
                Log In
              </Button>
              <Button
                href="/register"
                variant="contained"
                sx={{
                  backgroundColor: '#4A4458',
                  borderRadius: '50px', // Rounded edges
                  paddingX: 4, // Horizontal padding
                  paddingY: 1,  // Vertical padding
                  ':hover': {
                    backgroundColor: '#3b3748', // Hover color
                  },
                }}
              >
                Register
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Link href="#" variant="body2" sx={{ color: '#5D3FD3' }}>
              Forgot password?
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Signin;