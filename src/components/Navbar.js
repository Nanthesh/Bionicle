import React from "react";
import { AppBar, Toolbar, Typography, Box, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  logo: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "inherit",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  navLinks: {
    marginLeft: "auto",
    display: "flex",
    gap: "24px", 
  },
  activeLink: {
    color: "#6B3E99", 
    borderBottom: `2px solid #6B3E99`,
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Logo as text */}
        <Typography className={classes.logo}>EcosysTech</Typography>

        {/* Navigation Links */}
        <Box className={classes.navLinks}>
          <Link href="#" className={classes.activeLink} underline="none">
            Home
          </Link>
          <Link href="#" color="inherit" underline="none">
            Energy Saving Tips
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
