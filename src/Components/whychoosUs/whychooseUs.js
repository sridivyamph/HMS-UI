import React from 'react';
import { Grid, Box, Card, CardContent, Typography, Container } from '@mui/material';
import WhyChooseUs1 from '../../assets/WhychooseUs1.png';
import WhyChooseUs2 from '../../assets/WhychooseUs2.png';
import WhyChooseUs3 from '../../assets/WhychooseUs3.png';
import WhyChooseUs4 from '../../assets/WhychooseUs4.png';
import WhyChooseUs5 from '../../assets/WhychooseUs5.png';

// Feature items with title, description, and background image
const features = [
  {
    title: 'Highly experienced ',
    subTitle: 'professionals',
    image: WhyChooseUs1,
  },
  {
    title: 'The lowest fee ',
    subTitle: 'and best price',
    image: WhyChooseUs3,
  },
  {
    title: 'Quick and easy ',
    subTitle: 'booking',
    image: WhyChooseUs2,
  },
  {
    title: 'Regular and ',
    subTitle: '24-hour support',
    image: WhyChooseUs5,
  },

  {
    title: 'The possibility of buying ',
    subTitle: 'medicine with prescription',
    image: WhyChooseUs4,
  },
];

function WhyChooseUs() {
  return (
    <Box sx={{ padding: { xs: '16px', sm: '32px', md: '48px' } }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: '#2B2A29',
            fontSize: 32,
          }}>
          Why should you choose us
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ color: '#2B2A29', fontWeight: 18, mt: 1 }}>
          The reasons that make us the best site for booking doctors
        </Typography>
      </Box>

      {/* Features Grid */}
      <Container>
        {/* Layout Grid */}
        <Grid container spacing={3}>
          {/* Left Side: Two Images in a Vertical Stack */}
          <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={3}>
              {features.slice(0, 2).map((feature, index) => (
                <Grid item key={index}>
                  <Card
                    sx={{
                      height: index === 0 ? '350px' : '274px',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      background: `linear-gradient(to right, #04BA8E 1.69%, rgba(4, 186, 142, 0.8) 46.33%, rgba(4, 186, 142, 0) 100%),
                        url(${feature.image})`,
                      position: 'relative',
                      borderRadius: '16px',
                      color: '#fff',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}>
                    <CardContent
                      sx={{
                        mt: 1,
                      }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 24 }}>
                        {feature.title}
                      </Typography>
                      <br />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 24 }}>
                        {feature.subTitle}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right Side: Three Images in a Vertical Stack */}
          <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={3}>
              {features.slice(2).map((feature, index) => (
                <Grid item key={index}>
                  <Card
                    sx={{
                      height: '200px',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      background: `linear-gradient(to right, #04BA8E 1.69%, rgba(4, 186, 142, 0.8) 46.33%, rgba(4, 186, 142, 0) 100%),
                      url(${feature.image})`,
                      position: 'relative',
                      borderRadius: '16px',
                      color: '#fff',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}>
                    <CardContent
                      sx={{
                        mt: 1,
                      }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 24 }}>
                        {feature.title}
                      </Typography>
                      <br />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 24 }}>
                        {feature.subTitle}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default WhyChooseUs;
