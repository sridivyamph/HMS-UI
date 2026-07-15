import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Box, IconButton, Avatar, Menu, MenuItem, Container, Button,
} from '@mui/material';
import Logo from '../../assets/Logo.svg';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { getAppUserId } from '../../Services/DoctorServices';

const AdminHeader = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminName, setAdminName] = useState('');
  const open = Boolean(anchorEl);

  useEffect(() => {
    getAppUserId().then((res) => {
      if (res?.username) setAdminName(res.username);
    });
  }, []);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
    setAnchorEl(null);
  };

  return (
    <AppBar
      position='static'
      sx={{ backgroundColor: 'rgba(164, 246, 225, 0.2)', boxShadow: 'none', py: 2 }}
    >
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0 16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt='Logo' style={{ height: '40px' }} />
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: '24px' }}>
            <Box
              sx={{
                display: 'flex',
                backgroundColor: '#fff',
                padding: '12px 30px',
                borderRadius: '64px',
                gap: '2px',
                alignItems: 'center',
              }}
            >
              <Avatar alt='Admin' src='/user.jpg' sx={{ width: 40, height: 40 }} />
              <Button
                endIcon={<ExpandMoreIcon />}
                onClick={handleMenuOpen}
                sx={{
                  fontFamily: "'Albert Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '24px',
                  textTransform: 'none',
                  color: '#2B2A29',
                  padding: 0,
                  ml: 1,
                  minWidth: 0,
                }}
              >
                {adminName || 'Loading...'}
              </Button>
              <Box sx={{ ml: 2 }}>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      borderRadius: '10px',
                      mt: 1.5,
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 22,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                      minWidth: 200,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      '& .MuiMenuItem-root': {
                        fontWeight: 500,
                        fontSize: '16px',
                        paddingY: '12px',
                        '& svg': { color: '#04BA8E' },
                        '&:hover': { backgroundColor: '#D6F2EC', color: '#04BA8E' },
                      },
                    },
                  }}
                >
                  <MenuItem onClick={handleLogout}>
                    <LogoutOutlinedIcon sx={{ fontSize: 20, mr: 1 }} /> Sign Out
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AdminHeader;
