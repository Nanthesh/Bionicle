import React, { useState, useEffect } from 'react';
import PrimarySearchAppBar from '../../components/Navbar.jsx';
import ActiveLastBreadcrumb from '../../components/Breadcrumb.jsx';
import { Box, Grid, Typography, Button, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlistItems from localStorage on component mount
  useEffect(() => {
    const storedWishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    setWishlistItems(storedWishlistItems);
  }, []);

  // Function to remove product from wishlist
  const handleRemoveFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist)); // Update in localStorage
    setWishlistItems(updatedWishlist); // Update state
  };
  // Function to add product to cart
  const handleAddToCart = (product) => {
    // Get current cart items from localStorage
    const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if the product is already in the cart
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

    if (existingItemIndex >= 0) {
      // Update the quantity if the product already exists
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // Add the new product to the cart
      currentCart.push({ id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1 });
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(currentCart));

    // Show success notification
    toast.success(`${product.title} has been added to your cart!`, {
      position: 'top-center',
      autoClose: 1500,
      theme: 'colored',
    });

  // Emit custom event for cart update
  window.dispatchEvent(new Event('cartUpdated'));
};
  // Render the wishlist items
  return (
    <div>
      <PrimarySearchAppBar />
      <ActiveLastBreadcrumb />
      
      <Box sx={{ padding: 2, marginBottom: '10px' }}>
        <Typography variant="h4" align="center" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#333' }}>
          Your Wishlist
        </Typography>
        {wishlistItems.length > 0 ? (
          <Grid container spacing={3}>
            {wishlistItems.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '12px', boxShadow: 2, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.title}
                    sx={{ objectFit: 'contain', width: '100%' }}
                  />
                  <CardContent sx={{ padding: 2, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                      ${product.price}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginBottom: 2, width: '100%' }}
                      onClick={() => {
                        handleAddToCart(product)
                      }}
                    >
                      Add to Cart
                    </Button>
                    <IconButton
                      color="secondary"
                      sx={{ position: 'absolute', top: 10, right: 10 }}
                      onClick={() => handleRemoveFromWishlist(product.id)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" color="text.secondary">
            Your wishlist is empty.
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default Wishlist;
