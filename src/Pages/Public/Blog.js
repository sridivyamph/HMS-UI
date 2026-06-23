import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import Header from '../../Components/Header/header';
import TopNavbar from '../../Components/TopNav/topNav';
import Footer from '../../Components/Footer/footer';
import ArticleIcon from '@mui/icons-material/Article';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const posts = [
  { icon: <HealthAndSafetyIcon />, title: 'Tips for a Healthy Heart', tag: 'Cardiology', desc: 'Learn about the best practices to maintain a healthy heart and prevent cardiovascular diseases.' },
  { icon: <TipsAndUpdatesIcon />, title: 'Managing Stress in Daily Life', tag: 'Wellness', desc: 'Effective strategies to manage stress and maintain mental well-being in your everyday routine.' },
  { icon: <ArticleIcon />, title: 'Understanding Your Lab Reports', tag: 'Education', desc: 'A simple guide to help you understand common lab test results and what they mean for your health.' },
  { icon: <HealthAndSafetyIcon />, title: 'Nutrition Tips for All Ages', tag: 'Nutrition', desc: 'Age-appropriate nutritional guidance to support health from childhood through the golden years.' },
  { icon: <TipsAndUpdatesIcon />, title: 'When to See a Specialist', tag: 'Guidance', desc: 'Know the warning signs that indicate it may be time to consult with a medical specialist.' },
  { icon: <ArticleIcon />, title: 'The Importance of Regular Checkups', tag: 'Prevention', desc: 'Why routine health screenings and annual checkups are vital for early detection and prevention.' },
];

const Blog = () => {
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
            Our Blog
          </Typography>
          <Typography variant='h6' sx={{ opacity: 0.9, maxWidth: 700, mx: 'auto' }}>
            Health tips, insights, and updates from our medical experts.
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {posts.map((post, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    height: 160,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(4, 186, 142, 0.04)',
                    color: '#04BA8E',
                  }}
                >
                  {React.cloneElement(post.icon, { sx: { fontSize: 64 } })}
                </Box>
                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Chip
                    label={post.tag}
                    size='small'
                    sx={{
                      backgroundColor: 'rgba(4, 186, 142, 0.1)',
                      color: '#04BA8E',
                      fontWeight: 600,
                      alignSelf: 'flex-start',
                      mb: 1.5,
                    }}
                  />
                  <Typography variant='h6' fontWeight={700} sx={{ color: '#2B2A29', mb: 1 }}>
                    {post.title}
                  </Typography>
                  <Typography variant='body2' sx={{ color: '#666', lineHeight: 1.7, flex: 1 }}>
                    {post.desc}
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

export default Blog;
