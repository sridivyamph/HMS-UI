import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Button,
  IconButton,
  Modal,
  Menu,
  MenuItem,
  Skeleton,
  Chip,
  Paper,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '../../../Components/Header/header';
import TopNavbar from '../../../Components/TopNav/topNav';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updatePatientDetailsThunk } from '../../../Redux/Modules/Patient/HomeThunk';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Footer from '../../../Components/Footer/footer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getPatientProfileById, getUserAppointment, cancelAppointment } from '../../../Services/PatientServices';
import CancelConfirmationDialog from '../../../Components/Dialogs/CancelConfirmationDialog/CancelConfirmationDialog';
import CancelSuccessDialog from '../../../Components/Dialogs/CancelSuccessDialog/CancelSuccessDialog';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScienceIcon from '@mui/icons-material/Science';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import WcIcon from '@mui/icons-material/Wc';
import CakeIcon from '@mui/icons-material/Cake';
import EditProfileDialog from '../../../Components/Dialogs/EditPatientProfileDialog/EditPatientProfileDialog';

const Profile = () => {
  const [userData, setuserData] = useState([]);
  const [anchorEl, setAnchorEl] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [prescription, setPrescriptionText] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    dob: '',
    gender: '',
  });
  const [userError, setUserError] = useState('');
  const [appointmentError, setAppointmentError] = useState('');
  const [cancelConfirmationOpen, setCancelConfirmationOpen] = useState(false);
  const [cancelSuccessOpen, setCancelSuccessOpen] = useState(false);
  const [cancelAppointmentData, setCancelAppointmentData] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rawUser, setRawUser] = useState(null);

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const userId = localStorage.getItem('regNo');
    setLoadingUser(true);
    setUserError('');
    getPatientProfileById(userId)
      .then((val) => {
        const userObject = val.data;
        setRawUser(userObject);

        const age = calculateAge(userObject.dateOfBirth);

        const userDetailsArray = [
          { label: 'Name', value: userObject.name || 'N/A', icon: <PersonIcon fontSize='small' /> },
          { label: 'Gender', value: userObject.gender || 'N/A', icon: <WcIcon fontSize='small' /> },
          { label: 'Age', value: age, icon: <CakeIcon fontSize='small' /> },
          { label: 'Phone', value: userObject.mobileNo || 'N/A', icon: <PhoneIcon fontSize='small' /> },
        ];
        setuserData(userDetailsArray);
      })
      .catch(() => setUserError('Unable to load profile details. Please try again later.'))
      .finally(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);
  const fetchAppointments = async () => {
    try {
      setAppointmentError('');
      setLoadingAppointments(true);
      const userId = localStorage.getItem('regNo');
      const payload = { param: userId };
      const postsResponse = await getUserAppointment(payload);
      const appointments = postsResponse.data.content.map((item) => ({
        date: new Date(item.bookingDate + ' ' + item.timeFrom).toLocaleString(),
        doctor: item.doctorName,
        specialty: item.categoryDetailName,
        qualifications: item.degree,
        location: 'Hebrew Clinic, Beach Road, Besant Nagar, Chennai',
        bookingId: item.rowId,
        ...item,
      }));
      setAppointments(appointments);
    } catch {
      setAppointmentError('Unable to load visit history. Please try again later.');
    } finally {
      setLoadingAppointments(false);
    }
  };

  const formatAppointmentDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
    });
  };
  const handleClose = (index) => {
    setAnchorEl((prev) => ({
      ...prev,
      [index]: null,
    }));
  };
  const handleClick = (event, index) => {
    setAnchorEl((prev) => ({
      ...prev,
      [index]: event.currentTarget,
    }));
  };

  const handleEditSubmit = async (updatedData) => {
    const regNo = localStorage.getItem('regNo');
    try {
      await dispatch(updatePatientDetailsThunk({ param: regNo, payload: updatedData })).unwrap();
      const val = await getPatientProfileById(regNo);
      const userObject = val.data;
      setRawUser(userObject);
      const age = calculateAge(userObject.dateOfBirth);
      setuserData([
        { label: 'Name', value: userObject.name || 'N/A', icon: <PersonIcon fontSize='small' /> },
        { label: 'Gender', value: userObject.gender || 'N/A', icon: <WcIcon fontSize='small' /> },
        { label: 'Age', value: age, icon: <CakeIcon fontSize='small' /> },
        { label: 'Phone', value: userObject.mobileNo || 'N/A', icon: <PhoneIcon fontSize='small' /> },
      ]);
    } catch {
      setUserError('Failed to update profile. Please try again.');
    }
  };

  const handleCancelAppointment = (appt) => {
    setCancelAppointmentData(appt);
    setCancelConfirmationOpen(true);
  };

  const handleConfirmCancel = async () => {
    const appt = cancelAppointmentData;
    const payload = {
      doctorId: appt.doctorId,
      regNo: localStorage.getItem('regNo'),
      patientId: localStorage.getItem('regNo'),
      date: appt.bookingDate,
      time: appt.timeFrom,
      hospitalId: 3,
      status: 'CANCELLED',
      bookingId: appt.appointmentId,
    };
    try {
      await cancelAppointment({ payload, param: appt.appointmentId });
      setCancelConfirmationOpen(false);
      setCancelSuccessOpen(true);
    } catch {
      setCancelConfirmationOpen(false);
    }
  };

  const initials = rawUser?.name
    ? rawUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const upcomingAppts = appointments.filter((a) => new Date(a.bookingDate) >= new Date()).length;

  return (
    <>
      <TopNavbar />
      <Header />
      <Box sx={{ backgroundColor: '#F5F7FA', minHeight: '100vh', pb: 6 }}>
        <Container>
          <Box sx={{ display: 'flex', alignItems: 'center', pt: 4, mb: 3 }}>
            <Button
              onClick={() => navigate('/patient/dashboard')}
              sx={{ minWidth: 'auto', mr: 1, color: '#2B2A29' }}
            >
              <ArrowBackIosIcon sx={{ fontSize: 20 }} />
            </Button>
            <Typography sx={{ fontWeight: 700, color: '#1A1A2E', fontSize: 26 }}>
              My Profile
            </Typography>
          </Box>

          {/* Profile Header Card */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              mb: 3,
              background: 'linear-gradient(135deg, #04BA8E 0%, #029E76 100%)',
              color: '#fff',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Grid container alignItems='center' spacing={3}>
                <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      fontSize: 36,
                      fontWeight: 700,
                      border: '3px solid rgba(255,255,255,0.5)',
                      mx: 'auto',
                    }}
                  >
                    {initials}
                  </Avatar>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='h5' fontWeight={700}>
                    {rawUser?.name || 'User'}
                  </Typography>
                  <Typography sx={{ opacity: 0.85, mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 16 }} /> {rawUser?.mobileNo || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                  <Button
                    variant='contained'
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setEditForm({
                        name: rawUser?.name || '',
                        dob: rawUser?.dateOfBirth || '',
                        gender: rawUser?.gender || '',
                      });
                      setEditOpen(true);
                    }}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      color: '#fff',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    }}
                  >
                    Edit Profile
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: '#E8F5E9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CalendarMonthIcon sx={{ color: '#04BA8E', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={700} color='#1A1A2E'>
                    {appointments.length}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Total Visits
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: '#FFF3E0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocalHospitalIcon sx={{ color: '#FF9800', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant='h5' fontWeight={700} color='#1A1A2E'>
                    {upcomingAppts}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Upcoming
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#F5F5F5' },
                }}
                onClick={() => navigate('/patient/profile/labreport')}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: '#E3F2FD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ScienceIcon sx={{ color: '#2196F3', fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant='h5' fontWeight={700} color='#1A1A2E'>
                    Lab Reports
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    View reports
                  </Typography>
                </Box>
                <ArrowForwardIosIcon sx={{ fontSize: 14, color: '#2196F3' }} />
              </Paper>
            </Grid>
          </Grid>

          {/* Main Content */}
          <Grid container spacing={3} alignItems='flex-start'>
            {/* Personal Details */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant='h6' fontWeight={700} color='#1A1A2E' mb={2}>
                    Personal Details
                  </Typography>

                  {userError ? (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography color='textSecondary' variant='body2'>
                        {userError}
                      </Typography>
                    </Box>
                  ) : loadingUser ? (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} variant='text' width='80%' height={32} sx={{ mb: 1 }} />
                      ))}
                    </>
                  ) : (
                    <Box>
                      {userData.map((item, index) => (
                        <Box
                          key={item.label + index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            py: 1.5,
                            borderBottom: index < userData.length - 1 ? '1px solid #F0F0F0' : 'none',
                          }}
                        >
                          <Box sx={{ color: '#04BA8E', display: 'flex' }}>{item.icon}</Box>
                          <Box>
                            <Typography variant='caption' color='textSecondary'>
                              {item.label}
                            </Typography>
                            <Typography variant='body2' fontWeight={600} color='#2B2A29'>
                              {item.value}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Visit Information */}
            <Grid item xs={12} md={8}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                <Accordion
                  defaultExpanded
                  sx={{
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                    borderRadius: 3,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#04BA8E' }} />}
                    sx={{
                      px: 3,
                      py: 1,
                      borderBottom: '1px solid #F0F0F0',
                    }}
                  >
                    <Typography variant='h6' fontWeight={700} color='#1A1A2E'>
                      Visit History
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    {appointmentError ? (
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color='textSecondary' variant='body2'>
                          {appointmentError}
                        </Typography>
                      </Box>
                    ) : loadingAppointments ? (
                      <Box sx={{ p: 3 }}>
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} variant='rectangular' height={48} sx={{ mb: 1, borderRadius: 1 }} />
                        ))}
                      </Box>
                    ) : appointments.length > 0 ? (
                      <Box>
                        {appointments.map((visit, index) => (
                          <Box
                            key={index}
                            sx={{
                              px: 3,
                              py: 2.5,
                              borderBottom: index < appointments.length - 1 ? '1px solid #F0F0F0' : 'none',
                              '&:hover': { bgcolor: '#FAFAFA' },
                              transition: 'background 0.2s',
                            }}
                          >
                            <Grid container alignItems='center' spacing={2}>
                              <Grid item xs={12} sm={3}>
                                <Typography variant='body2' fontWeight={600} color='#2B2A29'>
                                  {formatAppointmentDate(visit.bookingDate)}
                                </Typography>
                                {(visit.bookingStatus === 'X' || visit.status === 'CANCELLED') && (
                                  <Chip
                                    label='Cancelled'
                                    size='small'
                                    sx={{
                                      mt: 0.5,
                                      bgcolor: '#FFE5E5',
                                      color: '#E53935',
                                      fontWeight: 600,
                                      fontSize: 11,
                                      height: 22,
                                    }}
                                  />
                                )}
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <Typography variant='body2' color='#666'>
                                  {visit.doctorName}
                                </Typography>
                                <Typography variant='caption' color='textSecondary'>
                                  {visit.categoryDetailName}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                {visit.prescription ? (
                                  <Chip
                                    label={visit.prescription.length > 30 ? visit.prescription.slice(0, 30) + '...' : visit.prescription}
                                    size='small'
                                    variant='outlined'
                                    sx={{ borderColor: '#04BA8E', color: '#04BA8E', fontWeight: 500 }}
                                  />
                                ) : (
                                  <Typography variant='body2' color='textSecondary' fontStyle='italic'>
                                    No prescription
                                  </Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
                                {visit.bookingStatus !== 'X' && visit.status !== 'CANCELLED' && (
                                  <IconButton size='small' onClick={(e) => handleClick(e, index)}>
                                    <MoreVertIcon />
                                  </IconButton>
                                )}
                                <Menu
                                  anchorEl={anchorEl[index]}
                                  open={Boolean(anchorEl[index])}
                                  onClose={() => handleClose(index)}
                                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                  <MenuItem
                                    onClick={() => {
                                      handleCancelAppointment(visit);
                                      handleClose(index);
                                    }}
                                    sx={{
                                      color: '#E53935',
                                      fontSize: '14px',
                                      fontWeight: 500,
                                      px: 2,
                                      py: 1,
                                    }}
                                  >
                                    Cancel Appointment
                                  </MenuItem>
                                  {visit.prescription && (
                                    <MenuItem
                                      onClick={() => {
                                        setPrescriptionText(visit.prescription);
                                        setPrescriptionModal(true);
                                        handleClose(index);
                                      }}
                                      sx={{
                                        color: '#04BA8E',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        px: 2,
                                        py: 1,
                                      }}
                                    >
                                      View Prescription
                                    </MenuItem>
                                  )}
                                </Menu>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <CalendarMonthIcon sx={{ fontSize: 48, color: '#E0E0E0', mb: 1 }} />
                        <Typography color='textSecondary'>No visit records found.</Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />

      {/* Prescription Modal */}
      <Modal
        open={prescriptionModal}
        onClose={() => {
          setPrescriptionModal(false);
          setPrescriptionText('');
          setSelectedAppointment(null);
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
            <Typography variant='h6' fontWeight={600}>
              Prescription
            </Typography>
            <IconButton onClick={() => setPrescriptionModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            value={prescription}
            disabled
            inputProps={{ maxLength: 240 }}
          />
          <Box textAlign='right' mt={0.5}>
            <Typography variant='caption' color='textSecondary'>
              {prescription.length}/240
            </Typography>
          </Box>
        </Box>
      </Modal>

      <EditProfileDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={editForm}
        onSubmit={handleEditSubmit}
      />

      <CancelConfirmationDialog
        open={cancelConfirmationOpen}
        handleClose={() => setCancelConfirmationOpen(false)}
        cancelAppointmentData={cancelAppointmentData}
        handleConfirm={handleConfirmCancel}
      />

      <CancelSuccessDialog
        open={cancelSuccessOpen}
        handleClose={() => {
          setCancelSuccessOpen(false);
          fetchAppointments();
        }}
      />
    </>
  );
};

export default Profile;
