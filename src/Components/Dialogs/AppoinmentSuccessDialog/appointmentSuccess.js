import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import { getPatientProfileById } from '../../../Services/PatientServices';

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

const formatTime = (timeStr) => {
  if (!timeStr) return 'N/A';
  const [hourMin, period] = timeStr.split(' ');
  if (period) return timeStr;
  const [h, m] = timeStr.split(':');
  const hrs = parseInt(h);
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  const hour12 = hrs % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

const Row = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
    <Typography variant='body2' color='#6E6E6E'>{label}</Typography>
    <Typography variant='body2' color='#2B2A29' fontWeight={500}>{value || 'N/A'}</Typography>
  </Box>
);

const AppointmentSuccessDialog = ({ open, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [patientName, setPatientName] = useState('');
  const { bookedDoctorDetails, selectedDoctor, bookingAmount } = useSelector((state) => state.home);

  const {
    appointmentId, bookingDate, doctorName, timeFrom, consMode,
    paymentMethod, paymentStatus, categoryDetailName, hospitalName,
    reasonForVisit,
  } = bookedDoctorDetails || {};

  const specialization = selectedDoctor?.specialization || categoryDetailName;
  const qualification = selectedDoctor?.qualification;

  useEffect(() => {
    if (open) {
      const regNo = localStorage.getItem('regNo');
      if (regNo) {
        getPatientProfileById(regNo).then((res) => {
          setPatientName(res.data?.name || '');
        }).catch(() => {});
      }
    }
  }, [open]);

  const handleCopy = () => {
    navigator.clipboard.writeText(appointmentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const decodedConsMode = consMode === 'I' ? 'In-person'
    : consMode === 'V' ? 'Video'
    : consMode || 'N/A';

  const statusLabel = paymentStatus === 'CASH_PAID' || paymentStatus === 'Online Paid'
    ? 'Paid' : paymentStatus || 'Pending';

  const feeDisplay = bookingAmount
    ? `₹${(bookingAmount / 100).toLocaleString('en-IN')}`
    : 'N/A';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '.MuiDialog-paper': {
          padding: '32px',
          borderRadius: '24px',
          maxWidth: '520px',
          width: '100%',
        },
      }}
    >
      <Box display='flex' flexDirection='column' alignItems='center'>
        <CheckCircleIcon sx={{ fontSize: 64, color: '#04BA8E', mb: 1 }} />
        <Typography variant='h5' fontWeight={700} color='#1A1A2E'>
          Booking Confirmed!
        </Typography>
        <Typography variant='body2' color='#6E6E6E' sx={{ mb: 3 }}>
          Your appointment has been booked successfully
        </Typography>

        <Box
          sx={{
            width: '100%',
            bgcolor: '#F8FDFB',
            borderRadius: 3,
            border: '1px solid #E0F2EE',
            p: 3,
          }}
        >
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={1.5}>
            <Box>
              <Typography variant='caption' color='#6E6E6E'>Booking ID</Typography>
              <Typography variant='body1' fontWeight={700} color='#2B2A29'>
                {appointmentId || 'N/A'}
              </Typography>
            </Box>
            <Box display='flex' alignItems='center' gap={1}>
              <Chip label={statusLabel} size='small'
                sx={{
                  bgcolor: statusLabel === 'Paid' ? '#E6F7E6' : '#FFF3E0',
                  color: statusLabel === 'Paid' ? '#2E7D32' : '#E65100',
                  fontWeight: 600, fontSize: 12,
                }}
              />
              <IconButton size='small' onClick={handleCopy} sx={{ color: '#04BA8E' }}>
                <ContentCopyIcon fontSize='small' />
              </IconButton>
            </Box>
          </Box>

          {copied && (
            <Typography variant='caption' color='#04BA8E' sx={{ mb: 1, display: 'block' }}>
              Booking ID copied!
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant='subtitle2' color='#04BA8E' fontWeight={700} sx={{ mb: 1, letterSpacing: 0.5 }}>
            DOCTOR
          </Typography>
          <Typography variant='body1' fontWeight={600} color='#2B2A29'>
            {doctorName || 'N/A'}
          </Typography>
          {specialization && (
            <Typography variant='body2' color='#6E6E6E'>{specialization}</Typography>
          )}
          {qualification && (
            <Typography variant='body2' color='#6E6E6E'>{qualification}</Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant='subtitle2' color='#04BA8E' fontWeight={700} sx={{ mb: 1, letterSpacing: 0.5 }}>
            APPOINTMENT DETAILS
          </Typography>
          <Row label='Patient' value={patientName || localStorage.getItem('regNo')} />
          <Row label='Date' value={formatDate(bookingDate)} />
          <Row label='Time' value={formatTime(timeFrom)} />
          <Row label='Type' value={decodedConsMode} />
          <Row label='Reason' value={reasonForVisit || 'N/A'} />

          <Divider sx={{ my: 2 }} />

          <Typography variant='subtitle2' color='#04BA8E' fontWeight={700} sx={{ mb: 1, letterSpacing: 0.5 }}>
            PAYMENT
          </Typography>
          <Row label='Fee' value={feeDisplay} />
          <Row label='Method' value={paymentMethod === 'ONLINE_PAYMENT' ? 'Online Payment'
            : paymentMethod === 'PAY_AT_HOSPITAL' ? 'Pay at Hospital'
            : paymentMethod || 'N/A'} />
          <Row label='Status' value={statusLabel} />

          {hospitalName && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant='subtitle2' color='#04BA8E' fontWeight={700} sx={{ mb: 1, letterSpacing: 0.5 }}>
                HOSPITAL
              </Typography>
              <Typography variant='body2' color='#2B2A29'>{hospitalName}</Typography>
            </>
          )}
        </Box>

        <Button
          onClick={onClose}
          variant='contained'
          fullWidth
          sx={{
            mt: 3,
            backgroundColor: '#04BA8E',
            color: '#fff',
            borderRadius: '10px',
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#039e7a' },
          }}
        >
          Okay
        </Button>
      </Box>
    </Dialog>
  );
};

export default AppointmentSuccessDialog;
