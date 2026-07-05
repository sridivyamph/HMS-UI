import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PhoneIcon from '@mui/icons-material/Phone';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';

const TopNavbar = () => {
  return (
    <AppBar
      position='static'
      elevation={0}
      sx={{
        height: '55px',
        backgroundColor: '#fff',
        display: {
          xs: 'none', // Hide on extra-small devices
          sm: 'none', // Hide on small devices
          md: 'flex', // Show on medium devices and above
        },
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#034EA2' }}>
          <Typography
            variant='body1'
            sx={{
              color: '#2B2A29',
              marginRight: 2,
            }}
          >
            Emergency Contact
          </Typography>
          <IconButton edge='end' sx={{ color: '#034EA2', mx: 1 }}>
            <CallOutlinedIcon />
          </IconButton>
          <Typography
            variant='body1'
            sx={{
              color: '#034EA2',
            }}
          >
            8589088985
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
