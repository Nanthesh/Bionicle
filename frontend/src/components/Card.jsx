import React from 'react';
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export default function ProductCard({ title, description, image, price, onNotify, addToWishlist, id }) {
    const truncatedDescription = description.length > 100 ? description.slice(0, 100) + '...' : description;

    const handleAddToWishlist = () => {
        const product = { title, description, image, price, id };  // Use actual product id
        addToWishlist(product);  // Send the product to the parent component (Wishlist page)
        onNotify(`${title} has been added to wishlist`);
    };

    return (
        <Card sx={{ maxWidth: 345, height: 350, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: '20px 10px' }}>
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
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ padding: 1 }}>
                <IconButton aria-label="add to wishlist" onClick={handleAddToWishlist}>
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="add to cart" onClick={() => onNotify(`${title} has been added to cart`)}>
                    <AddShoppingCartIcon />
                </IconButton>
            </Box>
        </Card>
    );
}
