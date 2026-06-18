import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
} from '@mui/material';
import React, { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import HmsButton from '../../../Components/Buttons/HmsButton';

function ReceptionAppointmentConfirmation({
  onCloseSlot,
  selectedDoctorRec,
  slotConfirmationDetails,
}) {
  const [copied, setCopied] = useState(false);

  const bookingId =
    selectedDoctorRec?.bookingId ??
    selectedDoctorRec?.appointmentId ??
    slotConfirmationDetails?.bookingId;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      bgcolor='#fff'
      p={3}
      sx={{
        height: '100%',
        position: 'relative',
        fontFamily: "'Albert Sans', sans-serif",
        color: '#2B2A29',
      }}
    >
      <IconButton
        onClick={onCloseSlot}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: '#04BA8E',
        }}
      >
        <CloseIcon />
      </IconButton>
      <CheckCircleIcon sx={{ fontSize: 80, color: 'green', mb: 2 }} />

      <Typography
        variant='h5'
        gutterBottom
        sx={{ color: '#2B2A29', fontSize: '18px' }}
      >
        Booking has been done successfully
      </Typography>
      <Typography
        variant='h6'
        gutterBottom
        sx={{ color: '#2B2A29', fontSize: '14px' }}
      >
        Booking Details
      </Typography>
      <Card
        sx={{
          width: '100%',
          backgroundColor: '#04BA8E0A',
          borderRadius: 4,
          border: '1px solid #04BA8E0A ',
          mt: 2,
        }}
      >
        <CardContent>
          <Typography variant='h6' fontWeight='bold' align='center'>
            {selectedDoctorRec?.fullName || selectedDoctorRec?.doctorName}
          </Typography>
          <Typography variant='body1' color='textSecondary' align='center'>
            {selectedDoctorRec?.specialization || selectedDoctorRec?.specality}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant='body2' color='textSecondary' mt={3}>
        Booking ID
      </Typography>

      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        bgcolor='#F2FBF7'
        borderRadius={2}
        width={'100%'}
        px={2}
        py={1}
        mt={1}
      >
        <Typography variant='h6' fontWeight='bold'>
          {bookingId}
        </Typography>
        <IconButton size='small' onClick={handleCopy} sx={{ ml: 1 }}>
          <ContentCopyIcon fontSize='small' />
        </IconButton>
      </Box>

      <Typography variant='body2' mt={2}>
        Appointment is on{' '}
        <strong>
          {slotConfirmationDetails?.date || slotConfirmationDetails?.newDate} at{' '}
          {slotConfirmationDetails?.time || slotConfirmationDetails?.newTime}
        </strong>
      </Typography>
      <Typography variant='body2' color='textSecondary' mt={1}>
        We have sent a confirmation message on SMS and WhatsApp.
      </Typography>

      <Box marginTop={3} width='100%'>
        <HmsButton onClick={onCloseSlot}>Okay</HmsButton>
      </Box>

      {copied && (
        <Typography variant='caption' color='green' mt={1}>
          Booking ID copied to clipboard!
        </Typography>
      )}
    </Box>
  );
}

export default ReceptionAppointmentConfirmation;
