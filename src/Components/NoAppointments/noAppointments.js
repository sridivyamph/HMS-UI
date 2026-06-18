import React from 'react';
import { Box, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const NoAppointments = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      height='20vh'
      textAlign='center'
    >
      <CalendarTodayIcon sx={{ fontSize: 60, color: '#04BA8E', mb: 2 }} />

      <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#3c3c3c' }}>
        No Upcoming Appointments
      </Typography>

      <Typography variant='body1' sx={{ color: '#666' }}>
        You don’t have any appointments scheduled.
      </Typography>
    </Box>
  );
};

export default NoAppointments;
