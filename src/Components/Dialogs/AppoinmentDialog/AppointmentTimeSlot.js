import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

export default function AppointmentTimeSlot() {
  const timeSlots = [
    '10:00 a.m.',
    '11:00 a.m.',
    '12:00 p.m.',
    '1:00 p.m.',
    '2:00 p.m.',
    '3:00 p.m.',
    '4:00 p.m.',
    '5:00 p.m.',
  ];

  return (
    <Box sx={{ overflowX: 'auto', display: 'flex', gap: 2, p: 2, width: '100%', flexWrap: 'wrap' }}>
      {timeSlots.map((slot, index) => (
        <Box
          key={index}
          sx={{
            minWidth: 80,
            padding: 1,
            textAlign: 'center',
            border: '1px solid #04BA8E',
            borderRadius: 1,
            backgroundColor: index %2 === 0 ? '#6E6E6E3D' : '#fff',
          }}
        >
          <Typography variant="body2">{slot}</Typography>
        </Box>
      ))}
    </Box>
  );
}
