import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar } from '@mui/material';
import Header from '../../Components/Header/header';
import TopNavbar from '../../Components/TopNav/topNav';
import Footer from '../../Components/Footer/footer';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedIcon from '@mui/icons-material/Verified';
import AwardIcon from '@mui/icons-material/EmojiEvents';

const stats = [
  { icon: <LocalHospitalIcon />, value: '150+', label: 'Bed Capacity' },
  { icon: <GroupsIcon />, value: '50+', label: 'Expert Doctors' },
  { icon: <VerifiedIcon />, value: '10K+', label: 'Happy Patients' },
  { icon: <AwardIcon />, value: '15+', label: 'Years Experience' },
];

const AboutUs = () => {
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
            About Us
          </Typography>
          <Typography variant='h6' sx={{ opacity: 0.9, maxWidth: 700, mx: 'auto' }}>
            Dedicated to providing compassionate, world-class healthcare for our community.
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems='center'>
          <Grid item xs={12} md={6}>
            <Typography variant='h4' fontWeight={700} sx={{ color: '#2B2A29', mb: 3 }}>
              Welcome to Zautomate Healthcare
            </Typography>
            <Typography variant='body1' sx={{ fontSize: 18, lineHeight: 1.8, color: '#555', mb: 2 }}>
              At Zautomate, we believe that everyone deserves access to quality healthcare. Our
              state-of-the-art facility is equipped with the latest medical technology, and our team
              of dedicated professionals works tirelessly to ensure every patient receives
              personalized care and attention.
            </Typography>
            <Typography variant='body1' sx={{ fontSize: 18, lineHeight: 1.8, color: '#555' }}>
              From routine check-ups to complex surgeries, we offer a comprehensive range of medical
              services designed to meet the diverse needs of our community. Your health and
              well-being are our top priorities.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: 'rgba(4, 186, 142, 0.04)',
                borderRadius: 4,
                p: 4,
                border: '1px solid rgba(4, 186, 142, 0.15)',
              }}
            >
              <Typography variant='h5' fontWeight={600} sx={{ color: '#04BA8E', mb: 3 }}>
                Our Mission
              </Typography>
              <Typography variant='body1' sx={{ fontSize: 16, lineHeight: 1.8, color: '#555', mb: 3 }}>
                To deliver exceptional healthcare services with integrity, innovation, and
                compassion, improving the quality of life for every patient we serve.
              </Typography>
              <Typography variant='h5' fontWeight={600} sx={{ color: '#04BA8E', mb: 3 }}>
                Our Vision
              </Typography>
              <Typography variant='body1' sx={{ fontSize: 16, lineHeight: 1.8, color: '#555' }}>
                To be the leading healthcare provider known for clinical excellence, patient-centered
                care, and community impact.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ backgroundColor: '#f9fafb', py: 8 }}>
        <Container>
          <Typography
            variant='h4'
            fontWeight={700}
            textAlign='center'
            sx={{ color: '#2B2A29', mb: 6 }}
          >
            Our Achievements
          </Typography>
          <Grid container spacing={3} justifyContent='center'>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(4, 186, 142, 0.1)',
                      color: '#04BA8E',
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography variant='h4' fontWeight={800} sx={{ color: '#04BA8E' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#666', mt: 1 }}>
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default AboutUs;
