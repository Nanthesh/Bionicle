import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = sessionStorage.getItem('token');
      console.log('Token in sessionStorage:', token);

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        navigate('/signin');
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
          navigate('/signin'); // Redirect to login if the token is invalid
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/signin'); // Redirect to login if token validation fails
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while checking authentication
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
