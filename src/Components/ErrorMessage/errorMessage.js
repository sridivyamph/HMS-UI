import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Dialog, DialogContent, DialogActions, Typography, Button, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
const ErrorMessage = ({
  message = 'Something went wrong',
  open = false,
  onClose,
  variant = 'snackbar', // 'snackbar' or 'dialog'
  autoHideDuration = 6000, // only for snackbar
  // title = 'Payment Failed',
}) => {
  console.log(message, 'message');
  if (variant === 'dialog') {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='error-dialog'
        maxWidth='xs'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            textAlign: 'center',
            p: 3,
          },
        }}
      >
        {/* Icon */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: '#FDECEA',
              borderRadius: '50%',
              p: 2,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 48, color: '#D32F2F' }} />
          </Box>
        </Box>

        {/* Title & Message */}
        <DialogContent>
          {/* <Typography variant='h6' sx={{ fontWeight: 700, mb: 1, color: '#D32F2F' }}>
            {title}
          </Typography> */}
          <Typography variant='body1' sx={{ color: 'text.secondary' }}>
            {message || 'Something went wrong. Please try again later.'}
          </Typography>
        </DialogContent>

        {/* OK Button */}
        <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
          <Button
            onClick={onClose}
            variant='contained'
            sx={{
              backgroundColor: '#D32F2F',
              color: '#fff',
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#C62828',
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Default to snackbar
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity='error' sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorMessage;
