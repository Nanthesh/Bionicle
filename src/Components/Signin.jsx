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
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Logo from "../assets/Logo.jpeg";

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
  };

  const validatePassword = (password) => {
    const lengthRegex = /.{8,}/;
    const capitalLetterRegex = /[A-Z]/;
    const lowercaseLetterRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!lengthRegex.test(password)) {
      return 'Password must be at least 8 characters long.';
    }
    if (!capitalLetterRegex.test(password)) {
      return 'Password must contain at least one capital letter.';
    }
    if (!lowercaseLetterRegex.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!numberRegex.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!specialCharRegex.test(password)) {
      return 'Password must contain at least one special character.';
    }
    return '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSuccess = (response) => {
    console.log('Google login successful:', response);
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failed:', error);
  };

  return (
    <GoogleOAuthProvider clientId="324740845093-2fijp594fabl35q9289abg9tnjcajnqk.apps.googleusercontent.com">
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card sx={{ boxShadow: 3, borderRadius: '16px' }}>
          <CardContent>
            <Box display="flex" justifyContent="center" mb={3}>
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </Box>
            <Box textAlign="center" mb={2}>
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
                    placeholder="youremail@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    error={Boolean(error)}
                    helperText={error}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '50px' },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5D3FD3',
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    error={Boolean(passwordError)}
                    helperText={passwordError}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '50px' },
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
                <Grid item xs={12} textAlign="center">
                  <Link href="#" variant="body2" sx={{ color: '#5D3FD3' }}>
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </form>
          </CardContent>

          <CardActions sx={{ justifyContent: 'space-between', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: '#5D3FD3',
                    borderRadius: '50px',
                    ':hover': { backgroundColor: '#4b2fc4' },
                  }}
                >
                  Log In
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  href="/register"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: '#4A4458',
                    borderRadius: '50px',
                    ':hover': { backgroundColor: '#3b3748' },
                  }}
                >
                  Register
                </Button>
              </Grid>
            </Grid>

            <Box textAlign="center" sx={{ mt: 3 }}>
  <Typography variant="body2" sx={{ mb: 1 }}>
    OR
  </Typography>
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={handleGoogleFailure}
    render={(renderProps) => (
      <Button
        onClick={renderProps.onClick}
        disabled={renderProps.disabled}
        startIcon={
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google Logo"
            width="20"
            height="20"
          />
        }
        sx={{
          backgroundColor: '#4285F4', // Google blue color
          color: 'white', // White text
          borderRadius: '50px',
          fontWeight: 'bold',
          textTransform: 'none',
          width: '100%',
          height: '50px', // Set a specific height
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Add shadow for depth
          ':hover': { backgroundColor: '#357AE8' }, // Darker blue on hover
          '&:active': {
            backgroundColor: '#3367D6', // Even darker blue on active
          },
        }}
      >
        Sign in with Google
      </Button>
    )}
  />
</Box>

          </CardActions>
        </Card>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default Signin;
