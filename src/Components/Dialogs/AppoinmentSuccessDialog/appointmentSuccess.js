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
import DownloadIcon from '@mui/icons-material/Download';
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
  const parts = timeStr.split(' ');
  if (parts.length > 1) return timeStr;
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

const useInvoiceData = () => {
  const { bookedDoctorDetails, selectedDoctor, bookingAmount, bookingReason } = useSelector((state) => state.home);

  const {
    appointmentId, bookingDate, doctorName, timeFrom, consMode,
    paymentMethod, paymentStatus, categoryDetailName, hospitalName,
  } = bookedDoctorDetails || {};

  const specialization = selectedDoctor?.specialization || categoryDetailName;
  const qualification = selectedDoctor?.qualification;

  const consType = consMode === 'I' ? 'In-person'
    : consMode === 'V' ? 'Video' : consMode || 'N/A';

  const statusLabel = paymentStatus === 'CASH_PAID' || paymentStatus === 'Online Paid'
    ? 'Paid' : paymentStatus || 'Pending';

  const feeDisplay = bookingAmount
    ? `₹${(bookingAmount / 100).toLocaleString('en-IN')}`
    : 'N/A';

  const methodLabel = paymentMethod === 'ONLINE_PAYMENT' ? 'Online Payment'
    : paymentMethod === 'PAY_AT_HOSPITAL' ? 'Pay at Hospital'
    : paymentMethod || 'N/A';

  return {
    appointmentId, bookingDate, doctorName, timeFrom,
    specialization, qualification,
    consType, statusLabel, feeDisplay, methodLabel,
    hospitalName, bookingReason,
  };
};

const buildPrintHtml = (data, patientName) => {
  const {
    appointmentId, bookingDate, doctorName, timeFrom,
    specialization, qualification,
    consType, statusLabel, feeDisplay, methodLabel,
    hospitalName, bookingReason,
  } = data;

  const row = (label, value) =>
    `<tr><td style="color:#6E6E6E;padding:6px 0;font-size:13px">${label}</td><td style="color:#2B2A29;padding:6px 0;font-size:13px;font-weight:500;text-align:right">${value || 'N/A'}</td></tr>`;

  return `
    <html>
      <head>
        <title>Booking Invoice</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 30px; color: #2B2A29; }
          .header { text-align: center; margin-bottom: 24px; }
          .header h2 { color: #04BA8E; margin: 0 0 4px; }
          .header p { color: #6E6E6E; margin: 0; font-size: 14px; }
          .card { border: 1px solid #E0F2EE; border-radius: 12px; padding: 24px; background: #F8FDFB; }
          .section-title { color: #04BA8E; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; margin: 16px 0 8px; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; }
          hr { border: none; border-top: 1px solid #E0F2EE; margin: 16px 0; }
          .footer { text-align: center; margin-top: 24px; color: #6E6E6E; font-size: 12px; }
          .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
          .badge-paid { background: #E6F7E6; color: #2E7D32; }
          .badge-pending { background: #FFF3E0; color: #E65100; }
          .booking-id { font-size: 18px; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Booking Confirmed</h2>
          <p>Your appointment has been booked successfully</p>
        </div>
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div>
              <div style="color:#6E6E6E;font-size:12px;">Booking ID</div>
              <div class="booking-id">${appointmentId || 'N/A'}</div>
            </div>
            <span class="badge ${statusLabel === 'Paid' ? 'badge-paid' : 'badge-pending'}">${statusLabel}</span>
          </div>

          <hr/>

          <div class="section-title">Doctor</div>
          <div style="font-size:15px;font-weight:600;">${doctorName || 'N/A'}</div>
          ${specialization ? `<div style="color:#6E6E6E;font-size:13px;">${specialization}</div>` : ''}
          ${qualification ? `<div style="color:#6E6E6E;font-size:13px;">${qualification}</div>` : ''}

          <hr/>

          <div class="section-title">Appointment Details</div>
          <table>
            ${row('Patient', patientName || 'N/A')}
            ${row('Date', formatDate(bookingDate))}
            ${row('Time', formatTime(timeFrom))}
            ${row('Type', consType)}
            ${row('Reason', bookingReason || 'N/A')}
          </table>

          <hr/>

          <div class="section-title">Payment</div>
          <table>
            ${row('Fee', feeDisplay)}
            ${row('Method', methodLabel)}
            ${row('Status', statusLabel)}
          </table>

          ${hospitalName ? `
            <hr/>
            <div class="section-title">Hospital</div>
            <div style="font-size:13px;">${hospitalName}</div>
          ` : ''}
        </div>
        <div class="footer">Thank you for choosing our service</div>
      </body>
    </html>
  `;
};

const AppointmentSuccessDialog = ({ open, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [patientName, setPatientName] = useState('');
  const invoiceData = useInvoiceData();
  const { appointmentId } = invoiceData;

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

  const handleDownload = () => {
    const html = buildPrintHtml(invoiceData, patientName);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    }
  };

  const {
    bookingDate, doctorName, timeFrom, specialization, qualification,
    consType, statusLabel, feeDisplay, methodLabel, hospitalName, bookingReason,
  } = invoiceData;

  return (
    <>
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
            <Row label='Type' value={consType} />
            <Row label='Reason' value={bookingReason || 'N/A'} />

            <Divider sx={{ my: 2 }} />

            <Typography variant='subtitle2' color='#04BA8E' fontWeight={700} sx={{ mb: 1, letterSpacing: 0.5 }}>
              PAYMENT
            </Typography>
            <Row label='Fee' value={feeDisplay} />
            <Row label='Method' value={methodLabel} />
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

          <Box display='flex' flexDirection='column' gap={1.5} width='100%' sx={{ mt: 3 }}>
            <Button
              onClick={handleDownload}
              variant='outlined'
              startIcon={<DownloadIcon />}
              fullWidth
              sx={{
                borderColor: '#04BA8E',
                color: '#04BA8E',
                borderRadius: '10px',
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { borderColor: '#039e7a', bgcolor: '#F0FDF9' },
              }}
            >
              Download Invoice
            </Button>
            <Button
              onClick={onClose}
              variant='contained'
              fullWidth
              sx={{
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
        </Box>
      </Dialog>
    </>
  );
};

export default AppointmentSuccessDialog;
