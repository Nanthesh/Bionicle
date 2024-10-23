import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Card, CardContent, IconButton, InputAdornment, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the regex patterns for validation (same as in Signup)
const lengthRegex = /.{8,}/;
const capitalLetterRegex = /[A-Z]/;
const lowercaseLetterRegex = /[a-z]/;
const numberRegex = /[0-9]/;
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Validate password function
  const validatePassword = (password) => {
    if (!lengthRegex.test(password)) return "Password must be at least 8 characters long";
    if (!capitalLetterRegex.test(password)) return "Password must contain at least one uppercase letter";
    if (!lowercaseLetterRegex.test(password)) return "Password must contain at least one lowercase letter";
    if (!numberRegex.test(password)) return "Password must contain at least one number";
    if (!specialCharRegex.test(password)) return "Password must contain at least one special character";
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the password before submitting
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send the reset request to the backend
      const response = await axios.post('http://localhost:4000/user/reset-password', {
        token,
        newPassword,
      });

      setMessage('Password has been reset successfully');
      navigate('/signin'); // Redirect to the sign-in page after successful reset
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Error resetting password. Try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card sx={{ boxShadow: 3, borderRadius: '16px' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Reset Password
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center" mb={3}>
            Enter your new password below.
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth variant="outlined" margin="normal" error={!!error}>
              <InputLabel htmlFor="newPassword">New Password</InputLabel>
              <OutlinedInput
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="New Password"
                sx={{ mb: 3 }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal" error={!!error}>
              <InputLabel htmlFor="confirmPassword">Confirm New Password</InputLabel>
              <OutlinedInput
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm New Password"
                sx={{ mb: 3 }}
              />
            </FormControl>

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
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ResetPassword;
