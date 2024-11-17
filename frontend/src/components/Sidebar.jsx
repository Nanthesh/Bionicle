import React, { useState } from 'react';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  Typography, Box, IconButton, ListSubheader, Popover, MenuItem, Divider
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SpaIcon from '@mui/icons-material/Spa';
import ForumIcon from '@mui/icons-material/Forum';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import Logo from "../assets/Logo.jpeg";
import AddIcon from '@mui/icons-material/Add';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Sidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to control sidebar visibility

  const menuItems = [
    { text: 'Energy Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
    { text: 'Energy Usage', icon: <TipsAndUpdatesIcon />, link: '/energyCalculator' },
    { text: 'Our-Products', icon: <SpaIcon />, link: '/product_page' },
    { text: 'Energy Saving Tips', icon: <TipsAndUpdatesIcon />, link: '/energy-tips' },
    { text: 'Add Device', icon: <AddIcon />, link: '/add-device' },
    { text: 'Device Management', icon: <ManageSearchIcon />, link: '/device_management_page' }
  ];

  const handleItemClick = (link) => {
    setActiveItem(link);
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: isSidebarOpen ? 240 : 60, // Adjust width based on state
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isSidebarOpen ? 240 : 60, // Adjust width based on state
            boxSizing: 'border-box',
            backgroundColor: 'white',
            color: 'black',
            overflowX: 'hidden' // Prevent horizontal scroll when closed
          },
        }}
      >
        <Box sx={{ padding: 2, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: isSidebarOpen ? '70px' : '40px',
                height: isSidebarOpen ? '70px' : '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                transition: 'width 0.3s, height 0.3s'
              }}
            />
            {isSidebarOpen && (
              <Typography variant="h5" sx={{ color: '#4a4a4a' }}>EcosysTech</Typography>
            )}
          </Box>
        </Box>

        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              component={Link}
              to={item.link}
              onClick={() => handleItemClick(item.link)}
              sx={{
                textDecoration: 'none',
                color: activeItem === item.link ? 'white' : 'black',
                backgroundColor: activeItem === item.link ? '#673ab7' : 'transparent',
                '&:hover': {
                  backgroundColor: '#673ab7',
                  color: 'white',
                },
                justifyContent: isSidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <ListItemIcon sx={{ color: activeItem === item.link ? 'white' : 'black' }}>
                {item.icon}
              </ListItemIcon>
              {isSidebarOpen && <ListItemText primary={item.text} />}
            </ListItem>
          ))}

          {isSidebarOpen && (
            <ListSubheader sx={{ backgroundColor: 'white', color: '#4a4a4a' }}>
              Community
            </ListSubheader>
          )}

          <ListItem
            button
            component={Link}
            to="/community"
            onClick={() => handleItemClick('/community')}
            sx={{
              textDecoration: 'none',
              color: activeItem === '/community' ? 'white' : 'black',
              backgroundColor: activeItem === '/community' ? '#673ab7' : 'transparent',
              '&:hover': {
                backgroundColor: '#673ab7',
                color: 'white',
              },
              justifyContent: isSidebarOpen ? 'flex-start' : 'center'
            }}
          >
            <ListItemIcon sx={{ color: activeItem === '/community' ? 'white' : 'black' }}>
              <ForumIcon />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Forums" />}
          </ListItem>
        </List>

        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', padding: 1 }}>
          <ListItem
            button
            component={Link}
            onClick={() => handleItemClick('/user-profile')}
            sx={{
              textDecoration: 'none',
              color: activeItem === '/user-profile' ? 'white' : 'black',
              backgroundColor: activeItem === '/user-profile' ? '#673ab7' : 'transparent',
              '&:hover': {
                backgroundColor: '#673ab7',
                color: 'white',
              },
              justifyContent: isSidebarOpen ? 'flex-start' : 'center'
            }}
          >
            <ListItemIcon sx={{ color: activeItem === '/user-profile' ? 'white' : 'black' }}>
              <PersonIcon />
            </ListItemIcon>
            {isSidebarOpen && (
              <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: 'auto' }}>
                <Typography variant="body1">User</Typography>
                <Typography
                  variant="body2"
                  component={Link}
                  to="/user-profile"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  sx={{
                    cursor: 'pointer',
                    color: 'gray',
                    textDecoration: 'none',
                  }}
                >
                  View profile
                </Typography>
              </Box>
            )}
            {isSidebarOpen && (
              <IconButton onClick={handleSettingsClick} sx={{ color: 'black', marginLeft: 'auto' }}>
                <SettingsIcon />
              </IconButton>
            )}
          </ListItem>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{
              padding: 0,
              minWidth: '220px',
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <MenuItem
              component={Link}
              to="/orders"
              sx={{ paddingY: 1.5, paddingX: 2.5 }}
              onClick={handleClose}
            >
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>My Orders</Typography>
            </MenuItem>

            <MenuItem
              component={Link}
              to="/user-profile"
              sx={{ paddingY: 1.5, paddingX: 2.5 }}
              onClick={handleClose}
            >
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>My Profile</Typography>
            </MenuItem>

            <Divider />

            <MenuItem
              component={Link}
              to="/Signin"
              onClick={() => {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('userEmail');
                sessionStorage.removeItem('hasNavigated');
                handleClose();
              }}
              sx={{ paddingY: 1.5, paddingX: 2.5, display: 'flex', alignItems: 'center' }}
            >
              <ListItemText>
                <Typography variant="body1" sx={{ fontSize: '1rem' }}>Logout</Typography>
              </ListItemText>
              <LogoutRoundedIcon sx={{ ml: 2, fontSize: '1.2rem', color: 'gray' }} />
            </MenuItem>
          </Popover>
        </Box>
      </Drawer>

      {/* Toggle Button */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          left: isSidebarOpen ? 240 : 60, // Adjust position based on sidebar state
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#673ab7',
          color: 'white',
          '&:hover': {
            backgroundColor: '#5e35b1',
          },
        }}
      >
        {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Box>
  );
};

export default Sidebar;
