import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token is in sessionStorage
    const token = sessionStorage.getItem('token');

    if (token) {
      // If the token exists, redirect to the dashboard
      navigate('/dashboard');
    }
  }, [navigate]);

  return null; // Or return a loading spinner, etc.
};

export default CheckAuth;