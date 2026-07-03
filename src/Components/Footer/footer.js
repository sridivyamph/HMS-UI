import React from 'react';
import { Box, Grid, Typography, Link, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '../../assets/LogoWhite.png';

const Footer = () => {
  return (
    <>
      <Box
        sx={{
          background: 'radial-gradient(50% 50% at 50% 50%, #01A37D 0%, #04BA8E 100%)',
          padding: '40px 0',
          color: '#fff',
        }}
      >
        <Container>
          <Grid container spacing={4} justifyContent='center'>
            {/* Services Section */}
            <Grid item xs={12} md={4}>
              <Typography
                variant='h6'
                gutterBottom
                sx={{
                  fontSize: 22,
                }}
              >
                Services
              </Typography>
              <Box
                component='div'
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  flexDirection: 'column',
                }}
              >
                {' '}
                <Typography variant='body2' sx={{ fontSize: 16, pt: 1.5 }}>
                  Body Surgery
                </Typography>
                <Typography variant='body2' sx={{ fontSize: 16, pt: 1.5 }}>
                  Heart Surgery
                </Typography>
                <Typography variant='body2' sx={{ fontSize: 16, pt: 1.5 }}>
                  Major operation
                </Typography>
                <Typography variant='body2' sx={{ fontSize: 16, pt: 1.5 }}>
                  Urgent care
                </Typography>
                <Typography variant='body2' sx={{ fontSize: 16, pt: 1.5 }}>
                  Child Care
                </Typography>
              </Box>
            </Grid>

            {/* Links Section */}
            <Grid item xs={12} md={4}>
              <Typography
                variant='h6'
                gutterBottom
                sx={{
                  fontSize: 22,
                }}
              >
                Links
              </Typography>
              <Box
                component='div'
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  flexDirection: 'column',
                }}
              >
                <Typography variant='body2'>
                  <Link
                    href='#'
                    color='inherit'
                    underline='none'
                    sx={{
                      pt: 1.5,
                      fontSize: 16,
                    }}
                  >
                    About us
                  </Link>
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    pt: 1.5,
                    fontSize: 16,
                  }}
                >
                  <Link component={RouterLink} to='/service' color='inherit' underline='none'>
                    Our Service
                  </Link>
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    pt: 1.5,
                    fontSize: 16,
                  }}
                >
                  <Link component={RouterLink} to='/gallery' color='inherit' underline='none'>
                    Gallery
                  </Link>
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    pt: 1.5,
                    fontSize: 16,
                  }}
                >
                  <Link component={RouterLink} to='/blog' color='inherit' underline='none'>
                    Blog
                  </Link>
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    pt: 1.5,
                    fontSize: 16,
                  }}
                >
                  <Link component={RouterLink} to='/careers' color='inherit' underline='none'>
                    Careers
                  </Link>
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    pt: 1.5,
                    fontSize: 16,
                  }}
                >
                  <Link component={RouterLink} to='/contact-us' color='inherit' underline='none'>
                    Contact us
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box
        component='footer'
        sx={{
          py: 2,
          textAlign: 'center',
          bgcolor: '#f9fafb',
          mt: 'auto',
          my: 3,
        }}
      >
        <Typography variant='body2' color='text.secondary'>
          © {new Date().getFullYear()}{' '}
          {/* <Link color='inherit' href='https://yourcompany.com' underline='hover'> */}
          Zautomate
          {/* </Link> */}. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Footer;
