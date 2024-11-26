import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      const token = sessionStorage.getItem('token');
      const publicRoutes = ['/signin', '/Signup', '/ForgotPassword', '/reset-password'];

      // Check if the user is on a public route
      const isPublicRoute = publicRoutes.some((route) =>
        location.pathname.startsWith(route)
      );

      // Skip validation if on a public route
      if (isPublicRoute) {
        setLoading(false);
        return;
      }

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        if (!isPublicRoute) {
          navigate('/signin');
        }
        return;
      }

      try {
        const response = await axios.post('http://localhost:4000/api/validate-token', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('token');
          setIsAuthenticated(false);
          navigate('/signin');
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [navigate, location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
