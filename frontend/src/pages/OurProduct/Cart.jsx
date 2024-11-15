import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import PrimarySearchAppBar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import ActiveLastBreadcrumb from '../../components/Breadcrumb.jsx';
import CartItem from './CartItem.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();
  const userEmail = sessionStorage.getItem('userEmail');

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem(`cartItems_${userEmail}`)) || [];
    setCartItems(storedItems);
    updateSubtotal(storedItems);
  }, []);

  const updateSubtotal = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(total);
  };

  const handleUpdate = (id, newQuantity) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem(`cartItems_${userEmail}`, JSON.stringify(updatedItems));
    updateSubtotal(updatedItems);
  };

  const handleRemove = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem(`cartItems_${userEmail}`, JSON.stringify(updatedItems));
    updateSubtotal(updatedItems);
  };

  return (
    <div>
      <PrimarySearchAppBar />
      <ActiveLastBreadcrumb />
      <ToastContainer />
      <Box
        sx={{
          padding: { xs: '16px', sm: '24px', md: '32px', lg: '64px' },
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: 3,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Shopping Cart
        </Typography>

        <Grid container spacing={4}>
          {/* Product List Section */}
          <Grid item xs={12} md={8}>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  product={item}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                />
              ))
            ) : (
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Your cart is empty
              </Typography>
            )}
          </Grid>

          {/* Subtotal and Checkout Section */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                padding: '18px',
                boxShadow: 2,
                maxWidth: '80%',
                margin: '0 auto',
                backgroundColor: 'white',
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                    textAlign: 'left',
                    marginBottom: '8px',
                  }}
                >
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items):
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.25rem' },
                    marginBottom: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  ${subtotal.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth={false}
                  onClick={() => navigate('/checkout')}
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    padding: '8px 24px',
                    borderRadius: '20px',
                    backgroundColor: '#6C63FF',
                    textTransform: 'none',
                    ':hover': {
                      backgroundColor: '#5a52cc',
                    },
                    display: 'block',
                    margin: '0 auto',
                  }}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </div>
  );
};

export default Cart;
