import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      height='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      textAlign='center'
      px={2}
      sx={{
        backgroundColor: '#fff',
      }}
    >
      {/* Oops Gradient Heading */}
      <Typography
        variant='h1'
        fontWeight={900}
        sx={{
          backgroundImage: 'linear-gradient(90deg, #6A11CB 0%, #2575FC 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontSize: { xs: '64px', sm: '96px' },
          lineHeight: 1.1,
          mb: 1,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        Oops!
      </Typography>

      {/* Sub Heading */}
      <Typography
        variant='h6'
        fontWeight={700}
        color='text.primary'
        sx={{ mb: 1, fontSize: { xs: '16px', sm: '20px' } }}
      >
        404 - PAGE NOT FOUND
      </Typography>

      {/* Message */}
      <Typography
        variant='body1'
        color='text.secondary'
        maxWidth='500px'
        sx={{ mb: 4, px: { xs: 2, sm: 0 } }}
      >
        The page you are looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </Typography>

      {/* Go Home Button */}
      <Button
        variant='contained'
        onClick={() => navigate('/patient/login')}
        sx={{
          backgroundColor: '#04BA8E',
          color: '#fff',
          fontWeight: 600,
          textTransform: 'none',
          px: 4,
          py: 1.5,
          fontSize: '1rem',
          borderRadius: '30px',
          boxShadow: '0 4px 12px rgba(4,186,142,0.3)',
          '&:hover': {
            backgroundColor: '#039e7c',
            boxShadow: '0 6px 16px rgba(4,186,142,0.4)',
          },
        }}
      >
        Go to Homepage
      </Button>
    </Box>
  );
};

export default NotFound;
