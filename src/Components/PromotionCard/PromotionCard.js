import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';

const PromotionCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = [
    {
      title: 'Online Consultation at',
      discount: '20% Discount',
      code: 'Decure 20',
      date: '',
      location: '',
      description: '* Terms and Conditions Apply',
    },
    {
      title: 'Blood Camp',
      discount: '',
      code: '',
      date: '12 September 2024',
      location: 'at Besant nagar',
      description: '* Pre bookings are welcome',
    },
    {
      title: 'Health Checkup',
      discount: '15% Discount',
      code: 'Health15',
      date: '',
      location: '',
      description: '* Terms and Conditions Apply',
    },
    {
      title: 'Free Vaccination Camp',
      discount: '',
      code: '',
      date: '30 September 2024',
      location: 'at City Hall',
      description: '* Pre bookings are welcome',
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <IconButton onClick={handlePrev} disabled={currentIndex === 0}>
        <ArrowBack />
      </IconButton>

      <Box
        sx={{
          background: 'linear-gradient(135deg, #04BA8E 50%, rgba(4, 186, 142, 0.7) 100%)',
          borderRadius: '10px',
          padding: '20px',
          color: '#fff',
          margin: '10px',
          width: { xs: '90%', sm: '45%' },
          height: '250px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Typography variant="h5" gutterBottom>
          {cards[currentIndex].title}
        </Typography>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {cards[currentIndex].discount}
        </Typography>
        {cards[currentIndex].code && (
          <Typography variant="body1" gutterBottom>
            Use Code: <strong>{cards[currentIndex].code}</strong>
          </Typography>
        )}
        {cards[currentIndex].location && (
          <Typography variant="h6" gutterBottom>
            {cards[currentIndex].location}
          </Typography>
        )}
        {cards[currentIndex].date && (
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            {cards[currentIndex].date}
          </Typography>
        )}
        <Typography variant="caption" display="block" sx={{ marginTop: '10px' }}>
          {cards[currentIndex].description}
        </Typography>
        <Button variant="contained" color="secondary" sx={{ marginTop: '20px' }}>
          {currentIndex === 1 ? 'Register Now' : 'Book Now'}
        </Button>
      </Box>

      <IconButton onClick={handleNext} disabled={currentIndex === cards.length - 1}>
        <ArrowForward />
      </IconButton>
    </Box>
  );
};

export default PromotionCards;
