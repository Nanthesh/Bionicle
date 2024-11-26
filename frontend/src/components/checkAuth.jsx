import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const CheckAuth = () => {
  const token = sessionStorage.getItem('token');
  const location = useLocation();

  const publicRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some((route) => location.pathname.startsWith(route));

  if (!token && !isPublicRoute) {
    return <Navigate to="/signin" />;
  }

  return null; // Render nothing for valid cases
};

export default CheckAuth;
