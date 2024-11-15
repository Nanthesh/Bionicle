import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const Info = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);


  // Load cart items from localStorage
  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');
    const storedItems = JSON.parse(localStorage.getItem(`cartItems_${userEmail}`)) || [];
    setCartItems(storedItems);

    // Calculate total price
    const total = storedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total.toFixed(2));
  }, []);

  return (
    <>
      {/* Total Price Section */}
      <Typography
        variant="subtitle2"
        sx={{ color: 'text.secondary', fontWeight: 'bold', marginBottom: '8px' }}
      >
        Sub Total
      </Typography>
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', marginBottom: '16px', color: 'primary.main' }}
      >
        ${totalPrice}
      </Typography>

      {/* List of Cart Products */}
      <List disablePadding>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
              <ListItemText
                primary={item.title}
                secondary={`Quantity: ${item.quantity}`}
                sx={{ mr: 2 }}
              />
              <Typography
                variant="body1"
                sx={{ fontWeight: '500', color: 'text.primary' }}
              >
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Your cart is empty.
          </Typography>
        )}
      </List>
    </>
  );
};

export default Info;
