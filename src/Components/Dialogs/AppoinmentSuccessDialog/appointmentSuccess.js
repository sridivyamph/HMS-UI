import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';

const AppointmentSuccessDialog = ({ open, onClose, setRouteName }) => {
  const [copied, setCopied] = useState(false);
  const { bookedDoctorDetails } = useSelector((state) => state.home);
  const { appointmentId, bookingDate, doctorName } = bookedDoctorDetails;
  const handleCopy = () => {
    navigator.clipboard.writeText(appointmentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '.MuiDialog-paper': {
          padding: '24px',
          borderRadius: '32px',
          maxWidth: '800px',
        },
      }}
    >
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        bgcolor='#fff'
        p={3}
      >
        {/* Success Icon */}
        <CheckCircleIcon sx={{ fontSize: 80, color: 'green', mb: 2 }} />

        {/* Booking Success Message */}
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
        {/* Booking Details */}
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
              {doctorName}
            </Typography>
            <Typography variant='body1' color='textSecondary' align='center'>
              Senior Dermatologist
            </Typography>

            {/* <Box display='flex' justifyContent='center' alignItems='center' mt={1} gap={1}>
              <SchoolIcon fontSize='small' />
              <Typography variant='body2'>MBBS, DNB, DVD, FCPS</Typography>
            </Box>

            <Box display='flex' justifyContent='center' alignItems='center' mt={1} gap={1}>
              <LocationOnIcon fontSize='small' />
              <Typography variant='body2'>Hebrew Clinic, Besant Nagar, Chennai.</Typography>
            </Box> */}
          </CardContent>
        </Card>

        {/* Booking ID */}
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
            {appointmentId}
          </Typography>
          <IconButton size='small' onClick={handleCopy} sx={{ ml: 1 }}>
            <ContentCopyIcon fontSize='small' />
          </IconButton>
        </Box>

        {/* Appointment Date & Confirmation Message */}
        <Typography variant='body2' mt={2}>
          Appointment is on <strong>{bookingDate}</strong>
        </Typography>
        <Typography variant='body2' color='textSecondary' mt={1}>
          We have sent a confirmation message on SMS and WhatsApp.
        </Typography>

        {/* Okay Button */}
        <Button
          onClick={() => {
            onClose();
          }}
          variant='contained'
          fullWidth
          type='submit'
          sx={{
            mt: 3,
            backgroundColor: '#04BA8E',
            color: '#fff',
            borderRadius: '8px',
            py: 2,
            '&:hover': {
              backgroundColor: '#04BA8E',
            },
          }}
        >
          Okay
        </Button>

        {/* Copy Success Message */}
        {copied && (
          <Typography variant='caption' color='green' mt={1}>
            Booking ID copied to clipboard!
          </Typography>
        )}
      </Box>
    </Dialog>
  );
};

export default AppointmentSuccessDialog;
