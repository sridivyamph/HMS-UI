import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Container, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Logo from '../../assets/Logo.svg';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { updateloginSignupAction } from '../../Redux/Modules/Patient/HomeSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { updateUserLogin } from '../../Redux/Modules/Patient/HomeSlice';
const Header = ({ handleOpen, showLogin = true }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isUserLoggedIn } = useSelector((state) => state.home);
  const menuItems = ['Doctors', 'Department', 'About Us'];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLoginMenuClick = (event) => {
    handleOpen();
    dispatch(updateloginSignupAction(event));
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(updateUserLogin(false));
    navigate('/patient/login');
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavClick = (item) => {
    const map = {
      Doctors: 'doctors-section',
      Department: 'department-section',
      'About Us': 'about-section',
    };
    const sectionId = map[item];
    const isPatientPage = location.pathname === '/patient/login';
    if (isPatientPage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/patient/login', { state: { scrollTo: sectionId } });
    }
  };

  return (
    <AppBar
      position='static'
      sx={{
        backgroundColor: '#F5FCFA',
        color: '#000',
        padding: '0 1rem',
        boxShadow: 'none',
      }}
    >
      <Container>
        <Toolbar>
          {/* Logo */}
          <Typography
            onClick={() => {
              navigate('/patient/dashboard');
            }}
            variant='body1'
            sx={{
              lineHeight: 0,
              flexGrow: {
                xs: 1,
                sm: 1,
                md: 0,
              },
            }}
          >
            <img src={Logo} alt='Logo' height='40px' />
          </Typography>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              ml: 'auto',
            }}
          >
            {menuItems.map((item, index) => (
              <Button
                key={index}
                onClick={() => handleNavClick(item)}
                sx={{
                  color: '#2B2A29',
                  margin: '0 16px',
                  textTransform: 'capitalize',
                  fontWeight: 500,
                  fontSize: '18px',
                }}
              >
                {item}
              </Button>
            ))}


            {/* Login Button */}
            {!isUserLoggedIn && (
              <Button
                onClick={() => handleLoginMenuClick('login')}
                sx={{
                  color: '#04BA8E',
                  margin: '0 16px',
                  textTransform: 'capitalize',
                  fontWeight: 500,
                  fontSize: '18px',
                }}
              >
                Login
              </Button>
            )}
          </Box>

          {/* Sign Up Button */}
          {!isUserLoggedIn ? (
            <Button
              variant='contained'
              onClick={() => handleLoginMenuClick('signup')}
              sx={{
                backgroundColor: '#04BA8E',
                color: '#fff',
                display: { xs: 'none', md: 'block' },
                marginLeft: 2,
                padding: '10px 56px',
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '18px',
                textTransform: 'capitalize',
                '&:hover': {
                  // Keep the background color the same on hover
                  backgroundColor: '#04BA8E', // Same as default
                },
              }}
            >
              Sign up
            </Button>
          ) : (
            <Box sx={{ ml: 4 }}>
              <IconButton
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
              </IconButton>

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
                <MenuItem onClick={() => navigate('/patient/dashboard')}>
                  <DashboardIcon sx={{ fontSize: 20, mr: 1 }} /> Dashboard
                </MenuItem>
                <MenuItem onClick={() => navigate('/patient/profile')}>
                  <PersonIcon sx={{ fontSize: 20, mr: 1 }} /> Profile
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  <LogoutOutlinedIcon sx={{ fontSize: 20, mr: 1 }} /> Sign Out
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* Hamburger Menu for Small Devices */}
          <IconButton
            edge='end'
            color='inherit'
            aria-label='menu'
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'flex', md: 'none' }, marginLeft: 'auto' }} // Hidden on medium and larger screens
          >
            <MenuIcon />
          </IconButton>

          {/* Drawer */}
          <Drawer anchor='left' open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box
              sx={{
                width: 250,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
              role='presentation'
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                {menuItems.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => handleNavClick(item)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      color: '#2B2A29',
                      margin: '8px 16px',
                      textTransform: 'capitalize',
                      fontWeight: 500,
                      fontSize: '18px',
                    }}
                  >
                    {item}
                  </Button>
                ))}
                <Divider />
                {/* Login Button in Drawer */}
                {!isUserLoggedIn && (
                  <ListItem>
                    <Button
                      onClick={() => handleLoginMenuClick('login')}
                      sx={{
                        color: '#04BA8E',
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        fontSize: '18px',
                      }}
                    >
                      Login
                    </Button>
                  </ListItem>
                )}

                {!isUserLoggedIn ? (
                  <ListItem>
                    <Button
                      onClick={() => handleLoginMenuClick('signup')}
                      sx={{
                        color: '#04BA8E',
                        // margin: '0 16px',
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        fontSize: '18px',
                        borderRadius: '8px',
                        fontWeight: 500,
                        fontSize: '18px',
                        backgroundColor: '#04BA8E',
                        color: '#fff',
                        padding: '10px 56px',
                        borderRadius: '8px',
                        '&:hover': {
                          // Keep the background color the same on hover
                          backgroundColor: '#04BA8E', // Same as default
                        },
                      }}
                    >
                      Sign up
                    </Button>
                  </ListItem>
                ) : (
                  <IconButton
                    onClick={() => {
                      navigate('/patient/profile');
                    }}
                    sx={{
                      marginLeft: 2,
                      fontWeight: 500,
                      fontSize: '18px',
                      color: '#04BA8E',
                      backgroundColor: '#04BA8E0A',
                    }}
                  >
                    <AccountCircleIcon sx={{ fontSize: '32px', color: '#04BA8E' }} />
                  </IconButton>
                )}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
