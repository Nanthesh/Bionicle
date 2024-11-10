import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Logo from "../assets/Logo.jpeg";

const CheckoutNavbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#131A22', color: '#ffffff' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo Section */}
        <Box display="flex" alignItems="center">
          <img src={Logo} alt="Amazon Logo" style={{ height: '35px', marginRight: '10px' }} />
          <Typography variant="h6" component="div">
            Secure Checkout
          </Typography>
        </Box>

        {/* Cart Icon Section */}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="cart"
          href="/cart" // Adjust the link to navigate to your cart page
        >
          <ShoppingCartIcon />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Cart
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default CheckoutNavbar;
