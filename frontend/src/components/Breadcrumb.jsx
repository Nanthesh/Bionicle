import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useLocation, Link as RouterLink } from 'react-router-dom'; // Import necessary hooks
import Box from '@mui/material/Box';

export default function ActiveLastBreadcrumb() {
  const location = useLocation(); // Get the current path
  const pathnames = location.pathname.split('/').filter((x) => x); // Split the path into parts

  return (
    <Box role="presentation" sx={{ marginTop: '20px', marginLeft: '10px' }}>
      <Breadcrumbs aria-label="breadcrumb">
        {/* Home Link */}
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          Bionicle
        </Link>

        {/* Dynamic Links */}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <Typography color="text.primary" key={to}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          ) : (
            <Link
              underline="hover"
              color="inherit"
              component={RouterLink}
              to={to}
              key={to}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
