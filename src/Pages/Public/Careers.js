import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button, Avatar } from '@mui/material';
import Header from '../../Components/Header/header';
import TopNavbar from '../../Components/TopNav/topNav';
import Footer from '../../Components/Footer/footer';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

const openings = [
  { icon: <MedicalServicesIcon />, title: 'Senior Cardiologist', type: 'Full-time', dept: 'Cardiology' },
  { icon: <MedicalServicesIcon />, title: 'Staff Nurse', type: 'Full-time', dept: 'Nursing' },
  { icon: <SchoolIcon />, title: 'Lab Technician', type: 'Full-time', dept: 'Diagnostics' },
  { icon: <WorkIcon />, title: 'Front Desk Executive', type: 'Full-time', dept: 'Administration' },
  { icon: <MedicalServicesIcon />, title: 'Pharmacist', type: 'Part-time', dept: 'Pharmacy' },
  { icon: <WorkIcon />, title: 'IT Support Specialist', type: 'Full-time', dept: 'Technology' },
];

const benefits = [
  'Competitive salary & performance bonuses',
  'Health & dental insurance',
  'Paid time off & holidays',
  'Professional development opportunities',
  'Retirement savings plans',
  'Supportive work environment',
];

const Careers = () => {
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
            Careers
          </Typography>
          <Typography variant='h6' sx={{ opacity: 0.9, maxWidth: 700, mx: 'auto' }}>
            Join our team and make a difference in healthcare.
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={7}>
            <Typography variant='h4' fontWeight={700} sx={{ color: '#2B2A29', mb: 4 }}>
              Open Positions
            </Typography>
            <Grid container spacing={3}>
              {openings.map((job, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-4px)' },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(4, 186, 142, 0.1)',
                          color: '#04BA8E',
                          width: 48,
                          height: 48,
                          mb: 2,
                        }}
                      >
                        {job.icon}
                      </Avatar>
                      <Typography variant='h6' fontWeight={700} sx={{ color: '#2B2A29', mb: 0.5 }}>
                        {job.title}
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#04BA8E', fontWeight: 600, mb: 0.5 }}>
                        {job.dept}
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#888', mb: 2 }}>
                        {job.type}
                      </Typography>
                      <Button
                        variant='outlined'
                        size='small'
                        sx={{
                          color: '#04BA8E',
                          borderColor: '#04BA8E',
                          textTransform: 'none',
                          '&:hover': { borderColor: '#04BA8E', backgroundColor: 'rgba(4, 186, 142, 0.04)' },
                        }}
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography variant='h4' fontWeight={700} sx={{ color: '#2B2A29', mb: 4 }}>
              Why Join Us?
            </Typography>
            <Box
              sx={{
                backgroundColor: 'rgba(4, 186, 142, 0.04)',
                borderRadius: 4,
                p: 4,
                border: '1px solid rgba(4, 186, 142, 0.15)',
              }}
            >
              <Typography variant='body1' sx={{ color: '#555', mb: 3, lineHeight: 1.8 }}>
                At Zautomate, we value our employees and provide a nurturing environment where
                professionals can grow, innovate, and make a real impact on patient lives.
              </Typography>
              {benefits.map((benefit, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#04BA8E',
                      mr: 2,
                    }}
                  />
                  <Typography variant='body2' sx={{ color: '#555' }}>
                    {benefit}
                  </Typography>
                </Box>
              ))}
              <Button
                variant='contained'
                fullWidth
                sx={{
                  mt: 3,
                  backgroundColor: '#04BA8E',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#039e7c' },
                }}
              >
                Submit Your Resume
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Careers;
