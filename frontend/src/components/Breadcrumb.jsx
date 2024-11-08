import React, {useState} from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useLocation, Link as RouterLink } from 'react-router-dom'; // Import necessary hooks
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function ActiveLastBreadcrumb() {
  const location = useLocation(); // Get the current path
  const pathnames = location.pathname.split('/').filter((x) => x); // Split the path into parts
  const [open, setOpen] =useState(false);
  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirmRedirect = () => {
    setOpen(false);
    navigate('/dashboard');
  };

  return (
    <Box role="presentation" sx={{ marginTop: '20px', marginLeft: '10px' }}>
    <Breadcrumbs aria-label="breadcrumb">
      {/* Home Link */}
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          display: { xs: 'none', sm: 'block' },
          color: 'blue',
          textDecoration: 'none',
        }}
      >
        {pathnames[0] === 'product_page' ? ( // Check if we are in product_page
          <span
            onClick={handleOpenDialog}
            style={{ color: 'black', cursor: 'pointer', textDecoration: 'none', fontWeight: '500' }}
          >
            Bionicle
          </span>
        ) : (
          <RouterLink to="/product_page" style={{ color: 'black', cursor: 'pointer', textDecoration: 'none', fontWeight: '500' }}>
            Product Page
          </RouterLink>
        )}
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

      {/* Dynamic Links */}
      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        const displayValue = value.charAt(0).toUpperCase() + value.slice(1);
        
        return isLast ? (
          <Typography color="text.primary" key={value}>
            {displayValue}
          </Typography>
        ) : (
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to={`/${value}`} // Ensure each part has a leading slash
            key={value}
          >
            {displayValue}
          </Link>
        );
      })}
    </Breadcrumbs>
  </Box>
  );
}
