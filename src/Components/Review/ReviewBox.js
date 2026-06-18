import React from 'react'
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Box, Typography } from '@mui/material';
const ReviewBox = () => {
  return (
    <Box>
      <Box>
        <Typography variant="h6" color={'#2B2A29'} fontSize={36} fontWeight={500}>4.5</Typography>
        <Box>
          <StarRoundedIcon fontSize="small" sx={{ mr: 1, mt: 1.3, fill: '#f7da0a' }} />
          <StarRoundedIcon fontSize="small" sx={{ mr: 1, mt: 1.3, fill: '#f7da0a' }} />
          <StarRoundedIcon fontSize="small" sx={{ mr: 1, mt: 1.3, fill: '#f7da0a' }} />
          <StarRoundedIcon fontSize="small" sx={{ mr: 1, mt: 1.3, fill: '#f7da0a' }} />
          <StarRoundedIcon fontSize="small" sx={{ mr: 1, mt: 1.3, fill: '#f7da0a' }} />
        </Box>
      </Box>
    </Box>
  )
}

export default ReviewBox