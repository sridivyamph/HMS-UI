import React from 'react';
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
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AdminHeader = ({ docName }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleMenuOpen = (event) => {
    event.stopPropagation(); // Prevent drawer from closing
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/#/admin/login';
    setAnchorEl(null);
  };

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
            <Box
              sx={{
                display: 'flex',
                backgroundColor: '#fff',
                padding: '12px 30px',
                borderRadius: '64px',
                gap: '2px',
              }}
            >
              {/* <Avatar
                alt='John Hebrews'
                src='/user.jpg' // replace with the profile image path
                sx={{ width: 40, height: 40 }}
              /> */}
              {/* <Button
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
                {docName}
              </Button> */}
              <Box sx={{ ml: 2 }}>
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
