import React from 'react';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent } from '@mui/material';
import Header from '../../Components/Header/header';
import TopNavbar from '../../Components/TopNav/topNav';
import Footer from '../../Components/Footer/footer';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BedIcon from '@mui/icons-material/Bed';

const galleryItems = [
  { icon: <LocalHospitalIcon />, title: 'Operation Theater', desc: 'State-of-the-art OT with advanced medical equipment.' },
  { icon: <MeetingRoomIcon />, title: 'Consultation Rooms', desc: 'Comfortable and private consultation spaces.' },
  { icon: <BedIcon />, title: 'Patient Wards', desc: 'Well-maintained wards for comfortable recovery.' },
  { icon: <LocalHospitalIcon />, title: 'ICU Unit', desc: 'Fully equipped intensive care unit.' },
  { icon: <MeetingRoomIcon />, title: 'Pharmacy', desc: 'Well-stocked pharmacy with all essential medicines.' },
  { icon: <BedIcon />, title: 'Waiting Area', desc: 'Spacious and comfortable waiting area for visitors.' },
];

const Gallery = () => {
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
            Gallery
          </Typography>
          <Typography variant='h6' sx={{ opacity: 0.9, maxWidth: 700, mx: 'auto' }}>
            Take a virtual tour of our world-class facility.
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {galleryItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(4, 186, 142, 0.04)',
                    color: '#04BA8E',
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 80 } })}
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant='h6' fontWeight={700} sx={{ color: '#2B2A29', mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant='body2' sx={{ color: '#666', lineHeight: 1.7 }}>
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Gallery;
