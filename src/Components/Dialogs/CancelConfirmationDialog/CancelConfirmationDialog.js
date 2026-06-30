import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const CancelConfirmationDialog = ({ open, handleClose, cancelAppointmentData, handleConfirm }) => {
  if (!cancelAppointmentData) return null;
  console.log(cancelAppointmentData, 'Canel');
  const { doctorName, date } = cancelAppointmentData;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='xs'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          textAlign: 'center',
          p: 2,
        },
      }}
    >
      {/* Warning Icon */}
      <Box
        sx={{
          bgcolor: '#FDEAEA',
          width: 72,
          height: 72,
          borderRadius: '50%',
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          boxShadow: '0 4px 12px rgba(229,57,53,0.2)',
        }}
      >
        <WarningAmberIcon sx={{ fontSize: 36, color: '#E53935' }} />
      </Box>

      {/* Title */}
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: '1.35rem',
          px: 3,
          pb: 1,
        }}
      >
        Cancel Appointment?
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 3 }}>
        <Typography variant='body1' sx={{ mb: 1.5, color: 'text.secondary' }}>
          Are you sure you want to cancel your appointment with
        </Typography>
        <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>
          {doctorName}
        </Typography>
        <Typography variant='body1' sx={{ mb: 2, color: 'text.secondary' }}>
          on <strong>{date}</strong>?
        </Typography>

        {/* <Typography
          variant='body2'
          sx={{
            color: '#E53935',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 500,
          }}
        >
          <WarningAmberIcon sx={{ fontSize: 18, mr: 0.5 }} />
          This action cannot be undone and may incur cancellation charges.
        </Typography> */}
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Button
          onClick={handleClose}
          variant='outlined'
          sx={{
            borderColor: '#E2E8F0',
            color: '#334155',
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            '&:hover': {
              borderColor: '#CBD5E1',
              bgcolor: '#F8FAFC',
            },
          }}
        >
          No, Keep It
        </Button>

        <Button
          onClick={handleConfirm}
          variant='contained'
          sx={{
            bgcolor: '#E53935',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#D32F2F',
            },
          }}
        >
          Yes, Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelConfirmationDialog;
