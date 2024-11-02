import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid2 as Grid, OutlinedInput, FormLabel, Button, Autocomplete, TextField, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { countries, canadianProvinces, usStates } from './countryData';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';


const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function UserProfile() {
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phone_number: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: null,  // Store the entire region object (not just the label)
    zipCode: '',
    country: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Error states for validation
  const [userNameError, setuserNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone_numberError, setphone_numberError] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');


  useEffect(() => {
  const token = sessionStorage.getItem('token');
  console.log('Checking token:', token); // Debug log

  if (!token) {
    console.log('No token found, redirecting to /Signin'); // Debug log
    navigate('/Signin');
    return;
  }

  axios.get('http://localhost:4000/api/profile', {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      const data = response.data;
      setFormData({
        userName: data.userName,
        email: data.email,
        phone_number: data.phone_number,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        city: data.city,
        state: usStates.find((state) => state.label === data.state) || canadianProvinces.find((province) => province.label === data.state),
        zipCode: data.zipCode,
        country: countries.find((c) => c.label === data.country),
      });
      if (data.country === 'Canada') setRegionOptions(canadianProvinces);
      else if (data.country === 'United States') setRegionOptions(usStates);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      setSnackbarMessage('Error fetching user data. Please try again later.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    });
}, [navigate]);

  useEffect(() => {
    // Validate postal or ZIP code whenever country or ZIP code changes
    validatePostalOrZipCode(formData.zipCode);
  }, [formData.country, formData.zipCode]);

  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });

    if (field === 'userName') {
        setuserNameError(/^[a-zA-Z0-9]*$/.test(value) ? '' : 'Alphanumeric characters only');
      } else if (field === 'email') {
        setEmailError(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.');
      } else if (field === 'phone_number') {
        setphone_numberError(/^\d+$/.test(value) ? '' :  'Please enter a valid phone number.');
      } else if (field === 'zipCode') {
        validatePostalOrZipCode(value);
      }
  };

  const validatePostalOrZipCode = (value) => {
    let isValid = true;
    if (formData.country?.code === 'CA') {
      // Canadian postal code format: A1A 1A1
      const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
      isValid = postalCodeRegex.test(value);
      setZipCodeError(isValid ? '' : 'Invalid Canadian postal code format (e.g., A1A 1A1)');
    } else if (formData.country?.code === 'US') {
      // U.S. ZIP code format: 12345 or 12345-6789
      const zipCodeRegex = /^\d{5}(-\d{4})?$/;
      isValid = zipCodeRegex.test(value);
      setZipCodeError(isValid ? '' : 'Invalid U.S. ZIP code format (e.g., 12345 or 12345-6789)');
    } else {
      // Allow any alphanumeric format for other countries
      const generalRegex = /^[A-Za-z0-9\s\-]*$/;
      isValid = generalRegex.test(value);
      setZipCodeError(isValid ? '' : 'Invalid postal/ZIP code format.');
    }
  };

  const handleCountryChange = (event, newValue) => {
    const updatedFormData = { ...formData, country: newValue, state: null };
    setFormData(updatedFormData);

    if (newValue?.label === 'Canada') setRegionOptions(canadianProvinces);
    else if (newValue?.label === 'United States') setRegionOptions(usStates);
    else setRegionOptions([]);
  };


  const toggleEditMode = () => {
    if (editMode) {
      // Refetch data to reset the form when exiting edit mode
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('JWT token not found. Ensure you are logged in.');
        setSnackbarMessage('Authentication error. Please log in again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        navigate('/Signin');
        return;
      }
  
      axios.get('http://localhost:4000/api/profile', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      })
        .then((response) => {
          const data = response.data;
          setFormData({
            userName: data.userName,
            email: data.email,
            phone_number: data.phone_number,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            city: data.city,
            state: usStates.find((state) => state.label === data.state) || canadianProvinces.find((province) => province.label === data.state) || data.state,
            zipCode: data.zipCode,
            country: countries.find((c) => c.label === data.country) || data.country,
          });
          if (data.country === 'Canada') setRegionOptions(canadianProvinces);
          else if (data.country === 'United States') setRegionOptions(usStates);
          else setRegionOptions([]);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setSnackbarMessage('Error fetching user data. Please try again later.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        });
    }
  
    setEditMode(!editMode);
  };

  const handleSaveProfile = () => {
    const { userName, email, phone_number, zipCode, firstName, lastName, address, city, state, country } = formData;
    if (!userName || !email || !phone_number || !zipCode || !firstName || !lastName || !address || !city || !state || !country) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    if (userNameError || emailError || phone_numberError || zipCodeError) return;
  
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('JWT token not found. Ensure you are logged in.');
      setSnackbarMessage('Authentication error. Please log in again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
  
    // Extract and format phone number, checking both possible keys
    let formattedPhoneNumber = formData.phone_number || '';
    formattedPhoneNumber = formattedPhoneNumber.replace(/\D/g, ''); // Remove non-numeric characters
    if (formattedPhoneNumber.length === 10) {
      formattedPhoneNumber = `+1${formattedPhoneNumber}`; // Add country code for Canada if 10 digits
    }
  
    const formattedData = {
      ...formData,
      phone_number: formattedPhoneNumber,
      state: formData.state?.label || formData.state,
      country: formData.country?.label || formData.country,
    };
  
    // Debug log to check if formData is updated before sending
    console.log('Sending formatted data:', formattedData);
  
    axios.put(
      'http://localhost:4000/api/profile',
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )
      .then((response) => {
        console.log('API Response:', response);
  
        if (response.status === 200) { // Check the status code instead
          setSnackbarMessage(response.data.message || 'Profile saved successfully!');
          setSnackbarSeverity('success');
          setEditMode(false);
        } else {
          console.warn('Unexpected response:', response);
          setSnackbarMessage('An error occurred. Please try again.');
          setSnackbarSeverity('error');
        }
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error('Error saving profile:', error);
  
        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data);
  
          if (error.response.data.errors) {
            console.error('Validation errors:', error.response.data.errors);
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Request setup error:', error.message);
        }
  
        setSnackbarMessage('An error occurred. Please try again later.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  };
  

  return (

    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
    {/* Sidebar */}
    <Sidebar />
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <Navbar />

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        px: { xs: 2, md: 3 },
        width: '90%',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 800, padding: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 500, mb: 4 }}>
            User Profile
          </Typography>

          <Grid container spacing={2}>
            {/* userName */}
            <FormGrid size={{ xs: 12 }}>
              <FormLabel htmlFor="userName" required>
                userName
              </FormLabel>
              <OutlinedInput
                id="userName"
                name="userName"
                placeholder="userName"
                fullWidth
                required
                value={formData.userName}
                onChange={handleFieldChange('userName')}
                error={Boolean(userNameError)}
                size="small"
                sx={{ borderRadius: '10px' }}
                readOnly={!editMode}
              />
              {userNameError && <Typography variant="body2" color="error">{userNameError}</Typography>}
            </FormGrid>

            {/* First Name and Last Name */}
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="first-name" required>
                First Name
              </FormLabel>
              <OutlinedInput
                id="first-name"
                name="first-name"
                placeholder="First Name"
                fullWidth
                required
                value={formData.firstName}
                onChange={handleFieldChange('firstName')}
                size="small"
                sx={{ borderRadius: '10px' }}
                readOnly={!editMode}
              />
            </FormGrid>

            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="last-name" required>
                Last Name
              </FormLabel>
              <OutlinedInput
                id="last-name"
                name="last-name"
                placeholder="Last Name"
                fullWidth
                required
                value={formData.lastName}
                onChange={handleFieldChange('lastName')}
                size="small"
                sx={{ borderRadius: '10px' }}
                readOnly={!editMode}
              />
            </FormGrid>

            {/* Email */}
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="email" required>
                Email
              </FormLabel>
              <OutlinedInput
                id="email"
                name="email"
                placeholder="Email"
                fullWidth
                required
                value={formData.email}
                onChange={handleFieldChange('email')}
                error={Boolean(emailError)}
                size="small"
                sx={{ borderRadius: '10px' }}
                readOnly={!editMode}
              />
              {emailError && <Typography variant="body2" color="error">{emailError}</Typography>}
            </FormGrid>

            {/* Phone Number */}
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="phone-number" required>
                Phone Number
              </FormLabel>
              <OutlinedInput
                id="phone-number"
                name="phone-number"
                placeholder="Phone Number"
                fullWidth
                required
                value={formData.phone_number}
                onChange={handleFieldChange('phone_number')}
                error={Boolean(phone_numberError)}
                size="small"
                sx={{ borderRadius: '10px' }}
                readOnly={!editMode}
              />
              {phone_numberError && <Typography variant="body2" color="error">{phone_numberError}</Typography>}
            </FormGrid>

            {/* Address Line 1 */}
            <FormGrid size={{ xs: 12 }}>
              <FormLabel htmlFor="address-line1" required>
                Address Line 1
              </FormLabel>
              <OutlinedInput
                id="address-line1"
                name="address-line1"
                placeholder="Street name and number"
                fullWidth
                required
                value={formData.address}
                onChange={handleFieldChange('address')}
                size="small"
                sx={{ borderRadius: '10px' }}
                readOnly={!editMode}
              />
            </FormGrid>

            {/* City and State */}
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="city" required>
                City
              </FormLabel>
              <OutlinedInput
                id="city"
                name="city"
                placeholder="City"
                fullWidth
                required
                value={formData.city}
                onChange={handleFieldChange('city')}
                size="small"
                sx={{ borderRadius: '10px' }}
                readOnly={!editMode}
              />
            </FormGrid>

            <FormGrid size={{ xs: 12, md: 6 }}>
  <FormLabel htmlFor="state" required>
    {formData.country?.code === 'CA' ? 'Province' : formData.country?.code === 'US' ? 'State' : 'State/Province'}
  </FormLabel>
  {!editMode ? (
    <Typography variant="body2" sx={{ padding: '8px 0' }}>
      {formData.state?.label || formData.state || 'N/A'}
    </Typography>
  ) : (
    (formData.country?.code === 'CA' || formData.country?.code === 'US') ? (
      <Autocomplete
        id="state"
        options={regionOptions}
        getOptionLabel={(option) => option.label}
        value={formData.state}
        onChange={(event, newValue) => setFormData({ ...formData, state: newValue || null })}
        renderInput={(params) => (
          <TextField {...params} placeholder={formData.country?.code === 'CA' ? 'Select Province' : 'Select State'} fullWidth size="small" />
        )}
        disabled={!editMode}
      />
    ) : (
      <OutlinedInput
        id="state"
        name="state"
        placeholder="State/Province"
        fullWidth
        value={formData.state || ''}
        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        size="small"
        sx={{ borderRadius: '10px' }}
        readOnly={!editMode}
      />
    )
  )}
</FormGrid>

  
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="zip-code" required>
                Zip / Postal Code
              </FormLabel>
              <OutlinedInput
                id="zip-code"
                name="zip-code"
                placeholder="Zip / Postal Code"
                fullWidth
                required
                value={formData.zipCode}
                onChange={handleFieldChange('zipCode')}
                error={Boolean(zipCodeError)}
                size="small"
                sx={{ borderRadius: '10px' }}
                readOnly={!editMode}
              />
              {zipCodeError && <Typography variant="body2" color="error">{zipCodeError}</Typography>}
            </FormGrid>

            <FormGrid size={{ xs: 12, md: 6 }}>
  <FormLabel htmlFor="country" required>
    Country
  </FormLabel>
  {!editMode ? (
    <Typography variant="body2" sx={{ padding: '8px 0' }}>
      {formData.country?.label || 'N/A'}
    </Typography>
  ) : (
    <Autocomplete
      id="country"
      options={countries}
      getOptionLabel={(option) => option.label}
      value={formData.country}
      onChange={handleCountryChange}
      renderInput={(params) => <TextField {...params} placeholder="Country" fullWidth size="small" />}
      disabled={!editMode}
    />
  )}
</FormGrid>

            {/* Edit / Save & Cancel Buttons */}
            <Grid item xs={12} textAlign="center">
              {!editMode ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={toggleEditMode}
                  sx={{ backgroundColor: '#5D3FD3', borderRadius: '50px', ':hover': { backgroundColor: '#4b2fc4' }}}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveProfile}
                    sx={{ backgroundColor: '#5D3FD3', borderRadius: '50px', ':hover': { backgroundColor: '#4b2fc4' }}}
                  >
                    Save Profile
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={toggleEditMode}
                    sx={{ ml: 2, backgroundColor: '#4A4458', borderRadius: '50px', color: 'white', ':hover': { backgroundColor: '#3b3748' }}}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
      >
      <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
           {snackbarMessage}
      </Alert>
      </Snackbar>
    </Box>
    </Box>
   </Box>
  );
}
