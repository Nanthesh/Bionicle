import React, { useState,useEffect } from 'react';
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
import { GoogleOAuthProvider } from '@react-oauth/google';
import Logo from "../../assets/Logo.jpeg";
import axios from 'axios';
import { signInWithGooglePopup } from "../../firebase.util"; // Assuming this is a Firebase utility function
import GoogleLogo from "../../assets/google-logo.png";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthProvider';


const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');     
  
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth(); 

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const hasNavigated = sessionStorage.getItem('hasNavigated');
    if (token && !hasNavigated) {
      console.log('Token found in sessionStorage, navigating to dashboard...');
      sessionStorage.setItem('hasNavigated', 'true');
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:4000/user/login', { email, password });
  
      // Handle successful login
      
      console.log('Login successful:', response.data);
  
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('userEmail', email);
      if (setIsAuthenticated) {
        setIsAuthenticated(true);
      }
      navigate('/dashboard');
    } catch (error) {
      console.log('Full error object:', error); // Log the entire error object
      
      if (error.response) {
        console.log('Error response data:', error.response.data); // Log the response data specifically
        
        if (error.response.status === 429) {
          setApiError(error.response.data.description || "Too many login attempts. Please try again later.");
        } else {
          setApiError(error.response.data.message || 'An error occurred during login.');
        }
      } else {
        setApiError('An unexpected error occurred. Please try again later.');
      }
      console.error('Error during login:', error);
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const logGoogleUser = async () => {
    try {
      const { user } = await signInWithGooglePopup();
      const googleUserData = {
        userName: user.displayName,
        email: user.email,
        uid: user.uid,
        provider: "google",
        phone_number: user.phoneNumber || "N/A",
      };

      // Send Google user data to the backend for verification or account creation
      const response = await axios.post('http://localhost:4000/user/google-login', googleUserData);

      // Handle successful Google login
      console.log('Google user logged in:', response.data);

      // Store the token if it is returned
      const token = response.data.token;
      if (token) {
       
        sessionStorage.setItem('token', token);
        console.log("Google user logged in and token saved");
        sessionStorage.setItem('userEmail',user.email);
        if (setIsAuthenticated) {
          setIsAuthenticated(true);
        }
        // Add a small delay before navigation
   
      navigate('/dashboard');

      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
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

            <form >
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
                  <Link href="/ForgotPassword" variant="body2" sx={{ color: '#5D3FD3' }}>
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
              {apiError && (
                <Typography variant="body2" color="error" textAlign="center" mt={2}>
                  {apiError}
                </Typography>
              )}
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
                  href="/Signup"
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
              <Button
                onClick={logGoogleUser}
                startIcon={
                  <img
                    src={GoogleLogo}
                    alt="Google"
                    style={{ width: '20px', height: '20px' }}
                  />
                }
                sx={{
                  backgroundColor: 'white',
                  color: '#757575',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  width: '100%',
                  height: '50px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                  ':hover': { backgroundColor: '#357AE8' ,color:'black'},
                  '&:active': { backgroundColor: '#3367D6' },
                }}
              >
                Sign in with Google
              </Button>
            </Box>
          </CardActions>
        </Card>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default Signin;
