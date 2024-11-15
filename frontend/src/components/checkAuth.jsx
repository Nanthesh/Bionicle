import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CheckAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const publicRoutes = ['/signin', '/Signup', '/forgot-password', '/reset-password'];

    // Check if the current route is a public route
    const isPublicRoute = publicRoutes.some((route) =>
      location.pathname.startsWith(route)
    );

    // If token exists and the current route is not public, redirect to dashboard
    if (token && !isPublicRoute) {
      navigate('/dashboard');
    }
  }, [navigate, location.pathname]);

  return null;
};

export default CheckAuth;
