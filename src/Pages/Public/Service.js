import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar } from '@mui/material';
import Header from '../../Components/Header/header';
import TopNavbar from '../../Components/TopNav/topNav';
import Footer from '../../Components/Footer/footer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealingIcon from '@mui/icons-material/Healing';
import BiotechIcon from '@mui/icons-material/Biotech';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AirlineSeatFlatIcon from '@mui/icons-material/AirlineSeatFlat';

const services = [
  { icon: <FavoriteIcon />, title: 'Body Surgery', desc: 'Advanced surgical procedures performed by expert surgeons using cutting-edge technology.' },
  { icon: <HealingIcon />, title: 'Heart Surgery', desc: 'Comprehensive cardiac care including bypass surgery, valve repair, and minimally invasive procedures.' },
  { icon: <BiotechIcon />, title: 'Major Operation', desc: 'Full-spectrum major operations with dedicated pre and post-operative care.' },
  { icon: <LocalHospitalIcon />, title: 'Urgent Care', desc: 'Immediate medical attention for emergencies with rapid response and advanced life support.' },
  { icon: <ChildCareIcon />, title: 'Child Care', desc: 'Specialized pediatric care from infancy through adolescence in a child-friendly environment.' },
  { icon: <AirlineSeatFlatIcon />, title: 'Inpatient Services', desc: 'Comfortable inpatient facilities with round-the-clock nursing care and monitoring.' },
];

const Service = () => {
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
            Our Services
          </Typography>
          <Typography variant='h6' sx={{ opacity: 0.9, maxWidth: 700, mx: 'auto' }}>
            Comprehensive healthcare solutions tailored to your needs.
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {services.map((service, index) => (
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
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(4, 186, 142, 0.1)',
                      color: '#04BA8E',
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {service.icon}
                  </Avatar>
                  <Typography variant='h6' fontWeight={700} sx={{ color: '#2B2A29', mb: 1.5 }}>
                    {service.title}
                  </Typography>
                  <Typography variant='body2' sx={{ color: '#666', lineHeight: 1.7 }}>
                    {service.desc}
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

export default Service;
