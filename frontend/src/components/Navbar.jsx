import React, { useState,useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar({ setSearchQuery }) {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const userEmail = sessionStorage.getItem('userEmail');
  useEffect(() => {
    
    const updateWishlistCount = () => {
      const wishlistItems = JSON.parse(localStorage.getItem(`wishlistItems${userEmail}`)) || [];
      setWishlistCount(wishlistItems.length);
    };
  
    // Initial fetch of wishlist count
    updateWishlistCount();
  
    // Listen for custom event
    window.addEventListener('wishlistUpdated', updateWishlistCount);
  
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
    };
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      
      const cartItems = JSON.parse(localStorage.getItem(`cartItems_${userEmail}`)) || [];
      const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalQuantity);
    };
  
    // Initial fetch of cart count
    updateCartCount();
  
    // Listen for custom event 'cartUpdated'
    window.addEventListener('cartUpdated', updateCartCount);
  
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirmRedirect = () => {
    setOpen(false);
    navigate('/dashboard'); // Redirect on confirmation
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Pass search input to parent component
  };

  const handleClickCart = () => {
    navigate('/cart');
  };

  const handleClickFavourite = () => {
    navigate('/wishlist'); // Navigate to the Wishlist page
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit" onClick={handleClickCart}>
          <Badge badgeContent={1} color="error">
            <AddShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
          <Badge badgeContent={7} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show wishlist" color="inherit" onClick={handleClickFavourite}>
          <Badge badgeContent={wishlistCount} color="error">
            <FavoriteBorderIcon />
          </Badge>
        </IconButton>
        <p>Wishlist</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, color: 'white' }}
          >
            <span
              onClick={handleOpenDialog}
              style={{ color: 'inherit', cursor: 'pointer', textDecoration: 'none' }}
            >
              Bionicle
            </span>
          </Typography>

          {/* Confirmation Dialog */}
          <Dialog
            open={open}
            onClose={handleCloseDialog}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="confirmation-dialog-description">
                Are you sure you want to exit our product page?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleConfirmRedirect} color="primary" autoFocus>
                Yes, exit
              </Button>
            </DialogActions>
          </Dialog>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Search sx={{ width: { xs: '100%', sm: '60%', md: '40%' } }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearchChange} // Handle search input changes
              />
            </Search>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton size="large" aria-label="show cart items" color="inherit" onClick={handleClickCart}>
             <Badge badgeContent={cartCount} color="error">
                <AddShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" aria-label="show wishlist" color="inherit" onClick={handleClickFavourite}>
              <Badge badgeContent={wishlistCount} color="error">
                <FavoriteBorderIcon />
              </Badge>
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
}
