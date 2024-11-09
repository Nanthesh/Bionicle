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

export default function ProductCard({ title, description, image, price,id }) {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const truncatedDescription = description.length > 100 ? description.slice(0, 100) + '...' : description;

    useEffect(() => {
        const currentWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        const isAlreadyInWishlist = currentWishlist.some(item => item.id === id);
        setIsInWishlist(isAlreadyInWishlist);
      }, [id]);
      const handleWishlistClick = (event) => {
        event.stopPropagation();
        const product = { title, description, image, price, id };
      
        const currentWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        const isAlreadyInWishlist = currentWishlist.some(item => item.id === id);
      
        if (isAlreadyInWishlist) {
          // Remove from wishlist
          const updatedWishlist = currentWishlist.filter(item => item.id !== id);
          localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
          setIsInWishlist(false);
      
          // Emit custom event
          window.dispatchEvent(new Event('wishlistUpdated'));
      
          toast.info(`${title} has been removed from your wishlist!`, {
            position: "top-center",
            autoClose: 1500,
            theme: "colored",
          });
        } else {
          // Add to wishlist
          const updatedWishlist = [...currentWishlist, product];
          localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
          setIsInWishlist(true);
      
          // Emit custom event
          window.dispatchEvent(new Event('wishlistUpdated'));
      
          toast.success(`${title} has been added to your wishlist!`, {
            position: "top-center",
            autoClose: 1500,
            theme: "colored",
          });
        }
      };

    return (

        <Card sx={{ maxWidth: 345, height: 350, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: '20px 10px' }}>
        <Link to={`/product_page/${id}`} style={{ textDecoration: 'none' }}>
            <CardMedia
                component="img"
                height="150"
                image={image}
                alt={title}
                sx={{
                    objectFit: 'contain', 
                    backgroundColor: 'white',
                }}
            />
            <CardContent>
                <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {truncatedDescription}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', marginTop: 1 }}>
                    ${price}
                </Typography>
            </CardContent>
       </Link>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ padding: 1 }}>
                <IconButton aria-label="add to wishlist" onClick={handleWishlistClick} >
                     <FavoriteIcon color={isInWishlist ? 'error' : 'inherit'} />
                </IconButton>
                <IconButton aria-label="add to cart">
                    <AddShoppingCartIcon />
                </IconButton>
            </Box>
        </Card>

    );
}
