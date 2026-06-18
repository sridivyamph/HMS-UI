import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const AdminUserSuccessDialog = ({ open, handleClose, apiResponse }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='cancel-success-dialog'
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: '#E6F7F4',
            borderRadius: '50%',
            p: 2,
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 48, color: '#04BA8E' }} />
        </Box>
      </Box>

      <DialogContent>
        <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
          User Added successfully
        </Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary' }}>
          {apiResponse}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
        <Button
          onClick={handleClose}
          variant='contained'
          sx={{
            backgroundColor: '#04BA8E',
            color: '#fff',
            borderRadius: '8px',
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#04BA8E',
            },
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminUserSuccessDialog;
