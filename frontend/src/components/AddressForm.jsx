import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, FormControl, FormLabel, OutlinedInput, Typography, Box, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';
import { countries, usStates, canadianProvinces } from '../pages/UserProfile/countryData';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const AddressForm = ({ setAddressData, setErrorCount }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  useEffect(() => {
    setAddressData(formData);
  }, [formData, setAddressData]);
  const [errors, setErrors] = useState({});
  const [isDataFetched, setIsDataFetched] = useState(false);

  // Fetch user profile data solo una vez
  useEffect(() => {
    if (isDataFetched) return;

    const fetchProfileData = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('User is not authenticated. Please log in.');
        return;
      }
      try {
        const response = await axios.get('http://localhost:4000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;

        const updatedData = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          address1: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.zipCode || '',
          country: data.country || '',
        };

        setFormData(updatedData);
        setAddressData(updatedData);
        setIsDataFetched(true); 
        validateFields(updatedData);
      } catch (error) {
        toast.error('Failed to load user profile. Please try again later.');
      }
    };

    fetchProfileData();
  }, [setAddressData, isDataFetched]);


  const validateFields = (data = formData) => {
    const newErrors = {};

    

  Object.keys(data).forEach((field) => {
    if (!data[field] || data[field].trim() === '') {
      newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
    }
  });


  const countryExists = countries.some((country) => country.label === data.country);
  if (!countryExists) {
    newErrors.country = 'Selected country is not valid.';
  }

  if (data.country === 'Canada') {
    const stateExists = canadianProvinces.some((province) => province.label === data.state);
    if (!stateExists) {
      newErrors.state = 'Selected province is not valid for Canada.';
    }
  } else if (data.country === 'United States') {
    const stateExists = usStates.some((state) => state.label === data.state);
    if (!stateExists) {
      newErrors.state = 'Selected state is not valid for the United States.';
    }
  }
  if (data.country === 'Canada') {
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
    if (!postalCodeRegex.test(data.zip)) {
      newErrors.zip = 'Invalid Canadian postal code format (e.g., A1A 1A1).';
    }
  } else if (data.country === 'United States') {
    const zipCodeRegex = /^\d{5}(-\d{4})?$/;
    if (!zipCodeRegex.test(data.zip)) {
      newErrors.zip = 'Invalid U.S. ZIP code format (e.g., 12345 or 12345-6789).';
    }
  } else {

    const generalPostalCodeRegex = /^[A-Za-z0-9\s\-]*$/;
    if (!generalPostalCodeRegex.test(data.zip)) {
      newErrors.zip = 'Invalid postal code format.';
    }
  }


    setErrors(newErrors);
    const errorCount = Object.keys(newErrors).length;
    console.log("Error count:", errorCount);


    setErrorCount(errorCount);
  };


  const handleFieldChange = (field) => (event) => {
    const updatedData = { ...formData, [field]: event.target.value };
    setFormData(updatedData);
    setAddressData(updatedData);

    validateFields(updatedData);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        padding: 3,
        borderRadius: '16px',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0',
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Shipping Address
      </Typography>
      <Grid container spacing={3}>
        {['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'country'].map((field, index) => (
          <FormGrid item xs={12} md={6} key={index}>
            <FormLabel>{`${field.charAt(0).toUpperCase() + field.slice(1)} *`}</FormLabel>
            <OutlinedInput
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleFieldChange(field)}
              fullWidth
              required
              error={Boolean(errors[field])}
            />
            {errors[field] && <Alert severity="error">{errors[field]}</Alert>}
          </FormGrid>
        ))}
      </Grid>
    </Box>
  );
};

export default AddressForm;
