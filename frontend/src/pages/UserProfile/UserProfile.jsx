import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid2 as Grid, OutlinedInput, FormLabel, Button, Autocomplete, TextField, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { countries, canadianProvinces, usStates } from './countryData';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function UserProfile() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
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
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/api/user/profile')
      .then((response) => {
        const data = response.data;
        setFormData({
          username: data.username,
          email: data.email,
          phoneNumber: data.phoneNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          addressLine1: data.addressLine1,
          city: data.city,
          state: usStates.find((state) => state.label === data.state) || canadianProvinces.find((province) => province.label === data.state),
          zipCode: data.zipCode,
          country: countries.find((c) => c.label === data.country),
        });
        if (data.country === 'Canada') setRegionOptions(canadianProvinces);
        else if (data.country === 'United States') setRegionOptions(usStates);
      })
      .catch((error) => {
        console.error('Error fetching user data', error);
        setSnackbarMessage('Error fetching user data. Please try again later.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  }, []);

  useEffect(() => {
    // Validate postal or ZIP code whenever country or ZIP code changes
    validatePostalOrZipCode(formData.zipCode);
  }, [formData.country, formData.zipCode]);

  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });

    if (field === 'username') {
        setUsernameError(/^[a-zA-Z0-9]*$/.test(value) ? '' : 'Alphanumeric characters only');
      } else if (field === 'email') {
        setEmailError(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.');
      } else if (field === 'phoneNumber') {
        setPhoneNumberError(/^\+?(\d.*){3,}$/.test(value) ? '' : 'Please enter a valid phone number.');
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
      // Clear the fields first
      setFormData({
        username: '',
        email: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        addressLine1: '',
        city: '',
        state: '',
        zipCode: '',
        country: null,
      });
  
      // Then refetch the data from the API
      axios.get('http://localhost:4000/api/user/profile')
        .then((response) => {
          const data = response.data;
          setFormData({
            username: data.username,
            email: data.email,
            phoneNumber: data.phoneNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            addressLine1: data.addressLine1,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: countries.find((c) => c.label === data.country),
          });
          if (data.country === 'Canada') setRegionOptions(canadianProvinces);
          else if (data.country === 'United States') setRegionOptions(usStates);
          else setRegionOptions([]);
        })
        .catch((error) => {
          console.error('Error fetching user data', error);
          setSnackbarMessage('Error fetching user data. Please try again later.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        });
    }
    setEditMode(!editMode);
  };

  const handleSaveProfile = () => {
    if (usernameError || emailError || phoneNumberError || zipCodeError) return;

    axios.post('http://localhost:4000/api/user/profile', formData)
      .then((response) => {
        if (response.data.code === 0) {
          setSnackbarMessage('Profile saved successfully!');
          setSnackbarSeverity('success');
          setEditMode(false);
        } else {
          setSnackbarMessage('An error occurred. Please try again.');
          setSnackbarSeverity('error');
        }
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error('Error saving profile', error);
        setSnackbarMessage('An error occurred. Please try again later.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
        px: { xs: 2, md: 3 },
        width: '100%',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 800, padding: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 500, mb: 4 }}>
            User Profile
          </Typography>

          <Grid container spacing={2}>
            {/* Username */}
            <FormGrid size={{ xs: 12 }}>
              <FormLabel htmlFor="username" required>
                Username
              </FormLabel>
              <OutlinedInput
                id="username"
                name="username"
                placeholder="Username"
                fullWidth
                required
                value={formData.username}
                onChange={handleFieldChange('username')}
                error={Boolean(usernameError)}
                size="small"
                sx={{ borderRadius: '10px' }}
                readOnly={!editMode}
              />
              {usernameError && <Typography variant="body2" color="error">{usernameError}</Typography>}
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
                value={formData.phoneNumber}
                onChange={handleFieldChange('phoneNumber')}
                error={Boolean(phoneNumberError)}
                size="small"
                sx={{ borderRadius: '10px' }}
                readOnly={!editMode}
              />
              {phoneNumberError && <Typography variant="body2" color="error">{phoneNumberError}</Typography>}
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
                value={formData.addressLine1}
                onChange={handleFieldChange('addressLine1')}
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
              {formData.country?.code === 'CA' || formData.country?.code === 'US' ? (
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
                // Render OutlinedInput for other countries
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
              <Autocomplete
                id="country"
                options={countries}
                getOptionLabel={(option) => option.label}
                value={formData.country}
                onChange={handleCountryChange}
                renderInput={(params) => <TextField {...params} placeholder="Country" fullWidth size="small" />}
                disabled={!editMode}
              />
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

      {/* Snackbar for showing success/error messages */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
