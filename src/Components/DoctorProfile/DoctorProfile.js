import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import Doctor from '../../assets/Doctor1.png';

const DoctorProfile = ({ name }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        ml: 2
      }}>
      <Avatar
        src={Doctor}
        alt={Doctor}
        sx={{ width: 40, height: 40, mr: 2, fontWeight: 500  }}
        
      />
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: 14,
            lineHeight: '28px',
            fontWeight: 500 
          }}>
          {name}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: 12,
            lineHeight: '28px',
            color: '#333333',
            fontWeight: 500 
          }}>
          Senior Dermatologist . 25 Years
        </Typography>
      </Box>
    </Box>
  )
}

export default DoctorProfile