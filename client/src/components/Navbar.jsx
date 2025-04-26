import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#2E7D32' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          EmbrAlrt
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/camera"
            startIcon={<CameraAltIcon />}
          >
            Camera
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/chat"
            startIcon={<ChatIcon />}
          >
            Chat
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 