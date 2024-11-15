import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function ProductCard({ title, description, image, price, id }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const truncatedDescription =
    description.length > 80 ? description.slice(0, 80) + '...' : description;
  const userEmail = sessionStorage.getItem('userEmail');

  useEffect(() => {
    const currentWishlist =
      JSON.parse(localStorage.getItem(`wishlistItems${userEmail}`)) || [];
    const isAlreadyInWishlist = currentWishlist.some(item => item.id === id);
    setIsInWishlist(isAlreadyInWishlist);
  }, [id]);

  const handleWishlistClick = event => {
    event.stopPropagation();
    const product = { title, description, image, price, id };

    const currentWishlist =
      JSON.parse(localStorage.getItem(`wishlistItems${userEmail}`)) || [];
    const isAlreadyInWishlist = currentWishlist.some(item => item.id === id);

    if (isAlreadyInWishlist) {
      const updatedWishlist = currentWishlist.filter(item => item.id !== id);
      localStorage.setItem(`wishlistItems${userEmail}`, JSON.stringify(updatedWishlist));
      setIsInWishlist(false);

      window.dispatchEvent(new Event('wishlistUpdated'));

      toast.info(`${title} has been removed from your wishlist!`, {
        position: 'top-center',
        autoClose: 1500,
        theme: 'colored',
      });
    } else {
      const updatedWishlist = [...currentWishlist, product];
      localStorage.setItem(`wishlistItems${userEmail}`, JSON.stringify(updatedWishlist));
      setIsInWishlist(true);

      window.dispatchEvent(new Event('wishlistUpdated'));

      toast.success(`${title} has been added to your wishlist!`, {
        position: 'top-center',
        autoClose: 1500,
        theme: 'colored',
      });
    }
  };

  const handleAddToCart = event => {
    event.stopPropagation();
    const product = { title, description, image, price, id };

    const currentCart =
      JSON.parse(localStorage.getItem(`cartItems_${userEmail}`)) || [];

    const existingItem = currentCart.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem(`cartItems_${userEmail}`, JSON.stringify(currentCart));

    toast.success(`${title} has been added to your cart!`, {
      position: 'top-center',
      autoClose: 1500,
      theme: 'colored',
    });

    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: 365,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: '20px 10px',
        padding: 1,
      }}
    >
      <Link to={`/product_page/${id}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          sx={{
            width: '100%',
            height: 150,
            objectFit: 'contain',
            backgroundColor: 'white',
          }}
          image={image}
          alt={title}
        />
        <CardContent sx={{ padding: '10px' }}>
          <Typography
            variant="h6"
            sx={{
              height: '40px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              height: '60px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'text.secondary',
            }}
          >
            {truncatedDescription}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'text.primary', marginTop: 1, height: '30px' }}
          >
            ${price}
          </Typography>
        </CardContent>
      </Link>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: 1 }}
      >
        <IconButton aria-label="add to wishlist" onClick={handleWishlistClick}>
          <FavoriteIcon color={isInWishlist ? 'error' : 'inherit'} />
        </IconButton>
        <IconButton aria-label="add to cart" onClick={handleAddToCart}>
          <AddShoppingCartIcon />
        </IconButton>
      </Box>
    </Card>
  );
}
