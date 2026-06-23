import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import Header from '../../Components/Header/header';
import TopNavbar from '../../Components/TopNav/topNav';
import Footer from '../../Components/Footer/footer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const contactInfo = [
  { icon: <PhoneIcon />, title: 'Phone', details: '1800 309 900', sub: '+1 (555) 123-4567' },
  { icon: <EmailIcon />, title: 'Email', details: 'info@zautomate.com', sub: 'support@zautomate.com' },
  { icon: <LocationOnIcon />, title: 'Address', details: '123 Healthcare Ave', sub: 'Medical District, NY 10001' },
  { icon: <AccessTimeIcon />, title: 'Working Hours', details: 'Mon - Sat: 8:00 AM - 8:00 PM', sub: 'Sun: 9:00 AM - 2:00 PM' },
];

const ContactUs = () => {
  return (
    <>
      <TopNavbar />
      <Header />
      <Box
        sx={{
          background: 'linear-gradient(135deg, #04BA8E 0%, #028a6b 100%)',
          py: 10,
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <Container>
          <Typography variant='h3' fontWeight={800} sx={{ mb: 2 }}>
            Contact Us
          </Typography>
          <Typography variant='h6' sx={{ opacity: 0.9, maxWidth: 700, mx: 'auto' }}>
            We are here to help. Get in touch with us today.
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Typography variant='h4' fontWeight={700} sx={{ color: '#2B2A29', mb: 4 }}>
              Get In Touch
            </Typography>
            <Grid container spacing={2}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(4, 186, 142, 0.1)',
                          color: '#04BA8E',
                          width: 48,
                          height: 48,
                        }}
                      >
                        {info.icon}
                      </Avatar>
                      <Box>
                        <Typography variant='body2' sx={{ color: '#888', fontWeight: 600 }}>
                          {info.title}
                        </Typography>
                        <Typography variant='body1' sx={{ color: '#2B2A29', fontWeight: 600 }}>
                          {info.details}
                        </Typography>
                        <Typography variant='body2' sx={{ color: '#666' }}>
                          {info.sub}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                backgroundColor: '#fff',
                borderRadius: 4,
                p: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              <Typography variant='h5' fontWeight={700} sx={{ color: '#2B2A29', mb: 3 }}>
                Send Us a Message
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Your Name' variant='outlined' size='medium' />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Your Email' variant='outlined' size='medium' />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label='Subject' variant='outlined' size='medium' />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Message'
                    variant='outlined'
                    multiline
                    rows={5}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant='contained'
                    sx={{
                      backgroundColor: '#04BA8E',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                      px: 5,
                      borderRadius: 2,
                      '&:hover': { backgroundColor: '#039e7c' },
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default ContactUs;
