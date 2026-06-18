import { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';

const AppoinmentUpdateDialog = ({ open, onClose, message }) => {
  const [copied, setCopied] = useState(false);
  const { bookedDoctorDetails } = useSelector((state) => state.home);
  const { appointmentId, bookingDate, doctorName } = bookedDoctorDetails;

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
        <Typography variant='h5' gutterBottom sx={{ color: '#2B2A29', fontSize: '18px' }}>
          {message}
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
      </Box>
    </Dialog>
  );
};

export default AppoinmentUpdateDialog;
