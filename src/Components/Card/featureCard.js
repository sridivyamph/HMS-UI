import React from 'react'
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import LanguageIcon from '@mui/icons-material/Language';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
const featureCard = ({ title, desc, imgName }) => {

  const renderImages = (action) => {
    switch (action) {
      case 'location':
        return <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />;
      case 'Education':
        return <SchoolOutlinedIcon fontSize="small" sx={{ mr: 1 }} />;
      case 'Recommended':
        return <ThumbUpOffAltIcon fontSize="small" sx={{ mr: 1 }} />;
      case 'Treatment':
        return <BrightnessHighIcon fontSize="small" sx={{ mr: 1, mt: 1.3 }} />;
      case 'languages':
        return <LanguageIcon fontSize="small" sx={{ mr: 1, mt: 1.3 }} />;
      case 'membership':
        return <CardMembershipIcon fontSize="small" sx={{ mr: 1, mt: 1.3 }} />;
      default:
        return <LocationOnIcon fontSize="small" sx={{ mr: 1, mt: 1.3 }} />;
    }
  };
  return (
    <Box bgcolor={'#f5f5f5'} width='45%' height={150} marginTop={2}>
      <Box p={2}>
        {renderImages(imgName)}
        <Typography variant="h5" component="div" fontFamily={'Albert Sans'} fontWeight={500} fontSize={18} mt={0.5} color={'#2B2A29'}>
          {title}
        </Typography>
        <Typography variant="h5" component="div" fontFamily={'Albert Sans'} fontWeight={400} fontSize={14} mt={0.5} color={'#6E6E6E'}>
          {desc}
        </Typography>
      </Box>
    </Box>
  )
}

export default featureCard