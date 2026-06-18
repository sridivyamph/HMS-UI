import React, { useState, useEffect } from 'react';
import Logo from '../../assets/Logo.svg';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Container,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useSelector, useDispatch } from 'react-redux';
import { appUserDataCall, appUserIdCall } from '../../Redux/Modules/LabTechnician/LabThunk';
import { useNavigate } from 'react-router-dom';

const LabHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const { appConfig, isConfigLoaded } = useSelector((state) => state.auth);
  const { userId, technicianData } = useSelector((state) => state.LabTechnician);

  const param = appConfig?.hospitalId;

  const TechieName = technicianData?.username;

  useEffect(() => {
    if (!isConfigLoaded || userId) return;

    const fetchUserId = async () => {
      try {
        await dispatch(appUserIdCall()).unwrap();
      } catch (err) {
        console.error('Error fetching userId:', err);
      }
    };

    fetchUserId();
  }, [isConfigLoaded, userId, dispatch]);

  useEffect(() => {
    if (!userId || !param || technicianData) return;

    const fetchUserData = async () => {
      const payload = { cloakId: userId, hosId: param };
      try {
        await dispatch(appUserDataCall(payload)).unwrap();
      } catch (err) {
        console.error('Error fetching technician data:', err);
      }
    };

    fetchUserData();
  }, [userId, param, technicianData, dispatch]);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/lab/login');
    setAnchorEl(null);
  };

  return (
    <AppBar
      position='static'
      sx={{
        backgroundColor: 'rgba(164, 246, 225, 0.2)',
        boxShadow: 'none',
        py: 2,
      }}
    >
      <Container maxWidth='xl' disableGutters>
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

            <Box
              sx={{
                display: 'flex',
                backgroundColor: '#fff',
                padding: '12px 30px',
                borderRadius: '64px',
                gap: '2px',
              }}
            >
              <Avatar alt='LabHeader' src='/user.jpg' sx={{ width: 40, height: 40 }} />
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
                {TechieName || 'Loading...'}
              </Button>

              <Box sx={{ ml: 2 }}>
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
                      minWidth: 200,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
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
                      '& .MuiMenuItem-root': {
                        fontWeight: 500,
                        fontSize: '16px',
                        paddingY: '12px',
                        '& svg': {
                          color: '#04BA8E',
                        },
                        '&:hover': {
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
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default LabHeader;
