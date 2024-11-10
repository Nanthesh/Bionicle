import React, { useState } from 'react';
import { 
  Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Typography, Box, IconButton, ListSubheader 
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
const Sidebar = () => {
  const location = useLocation(); // Detect current route
  const [activeItem, setActiveItem] = useState(location.pathname);

  const menuItems = [
    { text: 'Energy Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
    { text: 'Energy Calculator ', icon: <TipsAndUpdatesIcon />, link: '/energycalculator' },
    { text: 'Our-Products', icon: <SpaIcon />, link: '/product_page' },
    { text: 'Energy Saving Tips', icon: <TipsAndUpdatesIcon />, link: '/energy-tips' },
    {text: 'Add Device', icon: <AddIcon/>, link :'/add-device'},
    {text: "Device Management", icon :<ManageSearchIcon/>, link: ''}
  ];

  const handleItemClick = (link) => {
    setActiveItem(link);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: 'white', // Sidebar background set to white
          color: 'black',
        },
      }}
    >
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
                src={Logo}
                alt="Logo"
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
          <Typography variant="h5" sx={{ color: '#4a4a4a' }}>EcosysTech</Typography>
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
            }}
          >
            <ListItemIcon sx={{ color: activeItem === item.link ? 'white' : 'black' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        {/* Community Section */}
        <ListSubheader sx={{ backgroundColor: 'white', color: '#4a4a4a' }}>
          Community
        </ListSubheader>

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
          }}
        >
          <ListItemIcon sx={{ color: activeItem === '/community' ? 'white' : 'black' }}>
            <ForumIcon />
          </ListItemIcon>
          <ListItemText primary="Forums" />
        </ListItem>
      </List>

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', padding: 1 }}>
        <ListItem
          button
          component={Link}
          to="/user-profile"
          onClick={() => handleItemClick('/user-profile')}
          sx={{
            textDecoration: 'none',
            color: activeItem === '/user-profile' ? 'white' : 'black',
            backgroundColor: activeItem === '/user-profile' ? '#673ab7' : 'transparent',
            '&:hover': {
              backgroundColor: '#673ab7',
              color: 'white',
            },
          }}
        >
          <ListItemIcon sx={{ color: activeItem === '/user-profile' ? 'white' : 'black' }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="User" secondary="View profile" />

          {/* Settings Icon next to User */}
          <IconButton
            component={Link}
            to="/settings"
            sx={{ color: 'black', marginLeft: 'auto' }}
          >
            <SettingsIcon />
          </IconButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
