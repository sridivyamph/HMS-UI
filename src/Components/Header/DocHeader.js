import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Button,
  Drawer,
  Divider,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../../assets/Logo.svg';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAppUserId, getUserData } from '../../Services/DoctorServices';
import { useDispatch, useSelector } from 'react-redux';
import { updateDoctorOriginalId } from '../../Redux/Modules/Doctor/DoctorSlice';

const DocHeader = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [userCloakId, setUserCloakId] = useState();
  const [doctorName, setdoctorName] = useState('');
  const dispatch = useDispatch();
  const { appConfig, isConfigLoaded } = useSelector((state) => state.auth);
  const param = appConfig?.hospitalId;
  const handleMenuOpen = (event) => {
    event.stopPropagation(); // Prevent drawer from closing
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/doctor/login');
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!isConfigLoaded) return;
    getAppUserId().then((res) => {
      setUserCloakId(res?.userId);
    });
  }, [isConfigLoaded]);

  useEffect(() => {
    if (!userCloakId || !param) return;
    const payload = {
      hosId: param,
      cloakId: userCloakId,
    };
    getUserData(payload).then((res) => {
      dispatch(updateDoctorOriginalId(res?.doctorId));
      setdoctorName(res?.doctorName);
    });
  }, [userCloakId]);

  return (
    <AppBar
      position='static'
      sx={{ backgroundColor: 'rgba(164, 246, 225, 0.2)', boxShadow: 'none', py: 2 }}
    >
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0 16px' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt='Logo' style={{ height: '40px' }} />
          </Box>

          {/* Desktop View */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <IconButton color='default'>
              <NotificationsNoneIcon />
            </IconButton>
            <Button
              variant='contained'
              endIcon={<ExpandMoreIcon />}
              startIcon={
                <Box
                  sx={{
                    backgroundColor: '#04BA8E',
                    borderRadius: '50%',
                    height: '18px',
                    width: '18px',
                    border: '2px solid #fff',
                  }}
                />
              }
              sx={{
                textTransform: 'none',
                borderRadius: '64px',
                padding: '12px 30px',
                backgroundColor: '#04BA8E29',
                fontSize: 14,
                color: '#000',
                '&:hover': { backgroundColor: '#dff4f2' },
              }}
            >
              Active
            </Button>
            <Box
              sx={{
                display: 'flex',
                backgroundColor: '#fff',
                padding: '12px 30px',
                borderRadius: '64px',
                gap: '2px',
              }}
            >
              <Avatar
                alt='John Hebrews'
                src='/user.jpg' // replace with the profile image path
                sx={{ width: 40, height: 40 }}
              />
              <Button
                endIcon={<ExpandMoreIcon />}
                onClick={handleMenuOpen}
                sx={{
                  textTransform: 'none',
                  color: '#2B2A29',
                  fontWeight: 500,
                  fontSize: '14px',
                  padding: 0,
                  ml: 1,
                }}
              >
                {doctorName}
              </Button>
              <Box sx={{ ml: 2 }}>
                {/* <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    backgroundColor: '#04BA8E0A',
                    p: 1.2,
                    borderRadius: '12px',
                  }}
                >
                  <Box
                    component='span'
                    sx={{
                      position: 'relative',
                      width: 24,
                      height: 24,
                      mr: 1,
                      color: '#04BA8E',
                    }}
                  >
                    <AccountCircleIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <MenuIcon sx={{ fontSize: 24, color: '#04BA8E' }} />
                </IconButton> */}

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
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
                        // color: '#04BA8E',
                        paddingY: '12px',
                        '& svg': {
                          color: '#04BA8E',
                        },
                        '&:hover': {
                          // backgroundColor: '#E6F7F3',
                          backgroundColor: '#D6F2EC',
                          color: '#04BA8E',
                        },
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

          {/* Hamburger Icon for Mobile */}
          <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>

          {/* Drawer for Mobile Menu */}
          <Drawer anchor='left' open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box
              sx={{ width: 250, padding: '16px' }}
              role='presentation'
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              {/* Drawer Content */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <img src={Logo} alt='Logo' style={{ height: '40px' }} />
              </Box>
              <Divider sx={{ marginBottom: '16px' }} />
              {/* Notifications Icon */}
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <IconButton color='default'>
                  <NotificationsNoneIcon />
                </IconButton>
              </Box>
              {/* Active Button */}
              <Button
                variant='contained'
                endIcon={<ExpandMoreIcon />}
                startIcon={
                  <Box
                    sx={{
                      backgroundColor: 'rgba(4, 186, 142, 1)',
                      borderRadius: '50%',
                      height: '12px',
                      width: '12px',
                    }}
                  />
                }
                sx={{
                  textTransform: 'none',
                  borderRadius: '20px',
                  padding: '5px 16px',
                  backgroundColor: 'rgba(4, 186, 142, 0.16)',
                  color: '#000',
                  width: '100%',
                  marginBottom: '16px',
                  '&:hover': { backgroundColor: '#dff4f2' },
                }}
              >
                Active
              </Button>
              {/* User Menu */}
              <Box
                sx={{
                  display: 'flex',
                  backgroundColor: '#fff',
                  padding: '6px',
                  borderRadius: '64px',
                  gap: '2px',
                }}
              >
                <Avatar
                  alt='John Hebrews'
                  src='/user.jpg' // replace with the profile image path
                  sx={{ width: 40, height: 40 }}
                />
                <Button
                  endIcon={<ExpandMoreIcon />}
                  onClick={handleMenuOpen}
                  sx={{
                    textTransform: 'none',
                    color: 'rgba(43, 42, 41, 1)',
                    fontWeight: 500,
                    fontSize: '12px',
                    padding: 0,
                  }}
                >
                  {doctorName}
                </Button>
              </Box>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DocHeader;
