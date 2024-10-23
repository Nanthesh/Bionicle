import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Card, CardContent } from '@mui/material';
import { sendResetEmail  } from "../../firebase.util";
import axios from 'axios';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError('');
    setMessage('');
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    // Step 1: Check user type by making a request to the backend
    const response = await axios.post('http://localhost:4000/user/check-user', { email });

    // Step 2: Check the response to determine if the user is using Google Auth or local auth
    if (response.data.userType === 'google') {
      // If it's a Google user, use Firebase's sendResetEmail function
      await sendResetEmail(email);
      setMessage('Google password reset email sent! Check your inbox.');
    } else {
      // If it's a local user, use your backend's forgot password service
      const backendResponse = await axios.post('http://localhost:4000/user/forgot-password', { email });
      console.log(backendResponse.data); // Check the backend response
      setMessage('Password reset email sent! Check your inbox.');
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error in sending forgot password request:", error);
    setError('Failed to send password reset email. Please check your email and try again.');
  }
};
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card sx={{ boxShadow: 3, borderRadius: '16px' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Forgot Password
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center" mb={3}>
            Enter your email address to receive a password reset link.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              type="email"
              name="email"
              placeholder="youremail@example.com"
              value={email}
              onChange={handleEmailChange}
              sx={{ mb: 3 }}
            />
            {message && (
              <Typography variant="body2" color="success.main" align="center">
                {message}
              </Typography>
            )}
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#5D3FD3',
                borderRadius: '50px',
                ':hover': { backgroundColor: '#4b2fc4' },
              }}
            >
              Send Reset Email
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ForgotPassword;