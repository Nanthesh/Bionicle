import React, { useState, useEffect } from 'react';
import {
  Grid,
  FormControl,
  FormLabel,
  OutlinedInput,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';
import { countries, usStates, canadianProvinces } from '../pages/UserProfile/countryData';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const AddressForm = ({ setAddressData, setErrorCount, validateAllFieldsExternal }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  useEffect(() => {
    setAddressData(formData);
  }, [formData, setAddressData]);

  // Field-specific validation
  const validateField = (field, value) => {
    let error = '';

    if (!value || value.trim() === '') {
      error = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
    } else if (field === 'firstName' || field === 'lastName') {
      const nameRegex = /^[a-zA-Z]+$/;
      if (!nameRegex.test(value)) {
        error = `${field.charAt(0).toUpperCase() + field.slice(1)} can only contain alphabetic characters.`;
      }
    } else if (field === 'country') {
      const countryExists = countries.some((country) => country.label === value);
      if (!countryExists) {
        error = 'Selected country is not valid.';
      }
    } else if (field === 'state' && formData.country === 'Canada') {
      const stateExists = canadianProvinces.some((province) => province.label === value);
      if (!stateExists) {
        error = 'Selected province is not valid for Canada.';
      }
    } else if (field === 'state' && formData.country === 'United States') {
      const stateExists = usStates.some((state) => state.label === value);
      if (!stateExists) {
        error = 'Selected state is not valid for the United States.';
      }
    } else if (field === 'zip') {
      if (formData.country === 'Canada') {
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
        if (!postalCodeRegex.test(value)) {
          error = 'Invalid Canadian postal code format (e.g., A1A 1A1).';
        }
      } else if (formData.country === 'United States') {
        const zipCodeRegex = /^\d{5}(-\d{4})?$/;
        if (!zipCodeRegex.test(value)) {
          error = 'Invalid U.S. ZIP code format (e.g., 12345 or 12345-6789).';
        }
      } else {
        const generalPostalCodeRegex = /^[A-Za-z0-9\s\-]*$/;
        if (!generalPostalCodeRegex.test(value)) {
          error = 'Invalid postal code format.';
        }
      }
    }

    return error;
  };

  // Validate all fields (for "Next" button)
  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      if (fieldError) {
        newErrors[field] = fieldError;
      }
    });

    setErrors(newErrors);
    setErrorCount(Object.keys(newErrors).length);
    return Object.keys(newErrors).length === 0;
  };

  // Register external validation function
  useEffect(() => {
    if (validateAllFieldsExternal) {
      validateAllFieldsExternal(validateAllFields);
    }
  }, [validateAllFieldsExternal]);

  // Handle field changes and validation
  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    setAddressData(updatedData);

    // Mark field as touched
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

    // Validate only the field being changed
    const fieldError = validateField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: fieldError }));
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
            {touchedFields[field] && errors[field] && <Alert severity="error">{errors[field]}</Alert>}
          </FormGrid>
        ))}
      </Grid>
    </Box>
  );
};

export default AddressForm;
