import React, { useState } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Select, Card } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartItem = ({ product, onUpdate, onRemove }) => {
  const [quantity, setQuantity] = useState(product.quantity);
  const [isCustomQuantity, setIsCustomQuantity] = useState(product.quantity > 9);
  const [tempQuantity, setTempQuantity] = useState(product.quantity);
  const userEmail = sessionStorage.getItem('userEmail');
  const checkStockAvailability = async (productId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:4000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.stock_quantity; // Assuming the API response includes `stock_quantity`
    } catch (error) {
      console.error('Error fetching product stock:', error);
      return null;
    }
  };

  const handleQuantityChange = async (event) => {
    const value = event.target.value;
    if (value === '10+') {
      setIsCustomQuantity(true);
    } else {
      const newQuantity = parseInt(value, 10);
      
      // Check stock availability
      const stock = await checkStockAvailability(product.id);
      if (stock !== null && newQuantity > stock) {
        toast.error(`Only ${stock} items available in stock.`, {
          position: 'top-center',
          autoClose: 1500,
          theme: 'colored',
        });
        return; // Prevent updating quantity if it exceeds stock
      }
  
      setQuantity(newQuantity);
      onUpdate(product.id, newQuantity);
  
      // Update localStorage and emit custom event
      const updatedItems = JSON.parse(localStorage.getItem(`cartItems_${userEmail}`)) || [];
      const itemIndex = updatedItems.findIndex((item) => item.id === product.id);
      if (itemIndex !== -1) {
        updatedItems[itemIndex].quantity = newQuantity;
        localStorage.setItem(`cartItems_${userEmail}`, JSON.stringify(updatedItems));
        window.dispatchEvent(new Event('cartUpdated'));
      }
    }
  };
  
  const handleCustomQuantityChange = (event) => {
    const newQuantity = event.target.value.replace(/\D/g, '');
    setTempQuantity(newQuantity);
  };
  
  const handleUpdateClick = async () => {
    const newQuantity = parseInt(tempQuantity, 10);
  
    if (newQuantity > 0) {
      try {
        // API call to check stock with Authorization header
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/api/products/${product.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const availableStock = response.data.stock_quantity; // Assuming the API response has `stock_quantity`
  
        // Check if the requested quantity exceeds available stock
        if (newQuantity > availableStock) {
          toast.error(`Only ${availableStock} items in stock. Please adjust your quantity.`, {
            position: 'top-center',
            autoClose: 1500,
            theme: 'colored',
          });
          return; // Prevent updating quantity if it exceeds stock
        }
  
        // Update quantity and localStorage
        setQuantity(newQuantity);
        onUpdate(product.id, newQuantity);
  
        const updatedItems = JSON.parse(localStorage.getItem(`cartItems_${userEmail}`)) || [];
        const itemIndex = updatedItems.findIndex((item) => item.id === product.id);
        if (itemIndex !== -1) {
          updatedItems[itemIndex].quantity = newQuantity;
          localStorage.setItem(`cartItems_${userEmail}`, JSON.stringify(updatedItems));
          window.dispatchEvent(new Event('cartUpdated'));
        }
  
        // Reset to Select if quantity is between 1 and 9
        if (newQuantity >= 1 && newQuantity <= 9) {
          setIsCustomQuantity(false);
        }
      } catch (error) {
        console.error('Error fetching product stock:', error);
        toast.error('Failed to check stock. Please try again.', {
          position: 'top-center',
          autoClose: 1500,
          theme: 'colored',
        });
      }
    }
  };
  
  
  const handleRemoveClick = () => {
    onRemove(product.id);
  
    // Update localStorage and emit custom event
    const updatedItems = JSON.parse(localStorage.getItem(`cartItems_${userEmail}`)) || [];
    const filteredItems = updatedItems.filter((item) => item.id !== product.id);
    localStorage.setItem(`cartItems_${userEmail}`, JSON.stringify(filteredItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <Card
      sx={{
        padding: '16px',
        borderRadius: '8px',
        boxShadow: 2,
        marginBottom: '16px',
        backgroundColor: 'white',
        maxWidth: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'contain',
            marginBottom: { xs: '16px', sm: '0' },
          }}
        />
        <Box sx={{ flex: 1, paddingLeft: { xs: '0', sm: '16px' } }}>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' } }}
          >
            {product.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' } }}
          >
            {product.description}
          </Typography>
          <Typography variant="body2" color="green">
            In Stock
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              marginTop: '8px',
              gap: { xs: '8px', sm: '16px' },
            }}
          >
            {isCustomQuantity ? (
              <>
                <TextField
                  value={tempQuantity}
                  onChange={handleCustomQuantityChange}
                  sx={{ width: '80px', marginRight: '8px' }}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    style: { fontSize: '0.9rem' },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateClick}
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                >
                  Update
                </Button>
              </>
            ) : (
              <Select
                value={quantity}
                onChange={handleQuantityChange}
                sx={{ width: '80px', marginRight: '8px' }}
                MenuProps={{
                  PaperProps: { style: { maxHeight: '200px' } },
                }}
              >
                {[...Array(9).keys()].map((i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
                <MenuItem value="10+">10+</MenuItem>
              </Select>
            )}
            <Button
              variant="text"
              color="secondary"
              onClick={handleRemoveClick}
              sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
            >
              Delete
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            textAlign: 'right',
            minWidth: '100px',
            marginTop: { xs: '16px', sm: '0' },
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, fontWeight: 'bold',color:'gray' }}
          >
            Price:
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '0.85rem', sm: '1rem', md: '0.9rem' } }}
          >
            ${product.price.toFixed(2)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, marginTop: '8px', fontWeight: 'bold',color:'gray' }}
          >
            Total:
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '0.85rem', sm: '1rem', md: '0.9rem' } }}
          >
            ${(product.price * quantity).toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default CartItem;
