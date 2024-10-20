import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Logo from "../../assets/Logo.jpeg";
import Footer from '../../components/Footer';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { signInWithGooglePopup } from "../../firebase.util";
import GoogleLogo from "../../assets/google-logo.png";
import axios from 'axios';

// Define the regex patterns
const lengthRegex = /.{8,}/;
const capitalLetterRegex = /[A-Z]/;
const lowercaseLetterRegex = /[a-z]/;
const numberRegex = /[0-9]/;
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
const onlyStringRegex = /^[a-zA-Z ]*$/;
const onlyNumberRegex = /^[0-9]*$/;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    agreeToTerms: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validatePassword = (password) => {
    if (!lengthRegex.test(password)) return "Password must be at least 8 characters long";
    if (!capitalLetterRegex.test(password)) return "Password must contain at least one uppercase letter";
    if (!lowercaseLetterRegex.test(password)) return "Password must contain at least one lowercase letter";
    if (!numberRegex.test(password)) return "Password must contain at least one number";
    if (!specialCharRegex.test(password)) return "Password must contain at least one special character";
    return null;
  };

  const validate = () => {
    let errors = {};

    if (!formValues.username) {
      errors.username = "Username is required";
    } else if (!onlyStringRegex.test(formValues.username)) {
      errors.username = "Username must contain only letters";
    }

    if (!formValues.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Email address is invalid";
    }

    if (!formValues.password) {
      errors.password = "Password is required";
    } else {
      const passwordError = validatePassword(formValues.password);
      if (passwordError) errors.password = passwordError;
    }

    if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formValues.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (!onlyNumberRegex.test(formValues.phoneNumber)) {
      errors.phoneNumber = "Phone number must contain only numbers";
    }

    if (!formValues.agreeToTerms) errors.agreeToTerms = "You must agree to the terms and conditions";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const userData = {
          userName: formValues.username,
          email: formValues.email,
          password: formValues.password,
          phone_number: formValues.phoneNumber
        };

        const response = await axios.post('http://localhost:4000/user/register', userData);
        console.log('Form submitted successfully:', response.data);
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  const logGoogleUser = async () => {
    try {
      const { user } = await signInWithGooglePopup();
      const googleUserData = {
        userName: user.displayName,
        email: user.email,
        uid: user.uid,
        provider: "google",
        phone_number: "N/A",
      };
      const response = await axios.post('http://localhost:4000/user/register', googleUserData);
      console.log('Google user saved to database:', response.data);
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  useEffect(() => {
    const isValid = validate() && formValues.agreeToTerms;
    setIsFormValid(isValid);
  }, [formValues]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection="column"
      bgcolor="#f4f4f9"
      sx={{ paddingX: 2 }}
    >
      <Card
        sx={{
          p: 4,
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
          width: '100%',
          maxWidth: '400px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
          borderRadius: '15px',
          mt: 2,
        }}
      >
        <Box display="flex" justifyContent="center" mb={1}>
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

        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 'bold',
            color: '#1976d2',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Sign up
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            required
            id="outlined-username"
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={formValues.username}
            onChange={handleInputChange}
            error={!!formErrors.username}
            helperText={formErrors.username}
            sx={{ ...inputStyles }}
          />
          <TextField
            required
            id="outlined-email"
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={formValues.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            sx={{ ...inputStyles }}
          />

          <FormControl fullWidth variant="outlined" margin="normal" error={!!formErrors.password}>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formValues.password}
              onChange={handleInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              sx={{ ...inputStyles }}
            />
            {formErrors.password && (
              <Typography variant="caption" color="error">
                {formErrors.password}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal" error={!!formErrors.confirmPassword}>
            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formValues.confirmPassword}
              onChange={handleInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
              sx={{ ...inputStyles }}
            />
            {formErrors.confirmPassword && (
              <Typography variant="caption" color="error">
                {formErrors.confirmPassword}
              </Typography>
            )}
          </FormControl>

          <TextField
            required
            id="outlined-phone"
            label="Phone Number"
            name="phoneNumber"
            fullWidth
            margin="normal"
            value={formValues.phoneNumber}
            onChange={handleInputChange}
            error={!!formErrors.phoneNumber}
            helperText={formErrors.phoneNumber}
            sx={{ ...inputStyles }}
          />

          <Box display="flex" justifyContent="center" textAlign="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.agreeToTerms}
                  onChange={handleInputChange}
                  name="agreeToTerms"
                />
              }
              label="I agree to the Terms and Conditions"
            />
          </Box>
          {formErrors.agreeToTerms && (
            <Typography variant="caption" color="error" textAlign="center" sx={{ display: "flex", justifyContent: "center" }}>
              {formErrors.agreeToTerms}
            </Typography>
          )}

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button type="submit" variant="contained" sx={buttonStyles} disabled={!isFormValid}>Submit</Button>
            <Button href="/Signin" variant="contained" sx={secondaryButtonStyles}>Login</Button>
          </Box>
        </form>

        <Box textAlign="center" mt={2} sx={{ borderRadius: "15px" }}>
          <Typography variant="body2">or continue with:</Typography>
        </Box>
        <Box textAlign="center" mt={2} sx={{ borderRadius: "15px" }}>
          <Button
            variant="outlined"
            onClick={logGoogleUser}
            startIcon={<img src={GoogleLogo} alt="Google" style={{ width: '20px', height: '20px' }} />}
            sx={{
              backgroundColor: 'white',
              color: '#757575',
              borderColor: '#757575',
              textTransform: 'none',
              paddingX: 4,
              paddingY: 1,
              borderRadius: '50px',
              ':hover': {
                backgroundColor: '#f5f5f5',
                borderColor: '#757575',
              },
            }}
          >
            Sign in with Google
          </Button>
        </Box>
      </Card>
      <Footer />
    </Box>
  );
};

// Define input and button styles
const inputStyles = {
  borderRadius: '50px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
  },
  '& .MuiInputLabel-root': {
    fontSize: '1.1rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#5D3FD3',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4b2fc4',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#5D3FD3',
  },
};

const buttonStyles = {
  backgroundColor: '#5D3FD3',
  borderRadius: '50px',
  paddingX: 4,
  paddingY: 1,
  ':hover': {
    backgroundColor: '#4b2fc4',
  },
};

const secondaryButtonStyles = {
  backgroundColor: '#4A4458',
  borderRadius: '50px',
  paddingX: 4,
  paddingY: 1,
  ':hover': {
    backgroundColor: '#3b3748',
  },
};

export default Signup;
