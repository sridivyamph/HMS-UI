import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Accordion,
  TextField,
  AccordionSummary,
  AccordionDetails,
  Container,
  Button,
  IconButton,
  Modal,
  Menu,
  MenuItem,
  Chip,
  Skeleton,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Spinner from '../../../Components/Backdrop/Backdrop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DoctorProfile from '../../../Components/DoctorProfile/DoctorProfile';
import ReceptionAppointmentModal from '../AppointmentsModal/ReceptionAppointmentModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorListThunk } from '../../../Redux/Modules/Patient/HomeThunk';
import { useParams } from 'react-router-dom';
import {
  clearReceptionCache,
  updateSelectedDoctorRec,
} from '../../../Redux/Modules/Reception/ReceptionSlice';
import {
  getPatientProfileById,
  getAllUserAppointment,
  cancelAppointment,
} from "../../../Services/PatientServices";
import ReceptionHeader from "../../../Components/Header/ReceptionHeader";
import { updateCashPaymentStatusCall } from '../../../Redux/Modules/Reception/ReceptionThunk';
import PersonIcon from '@mui/icons-material/Person';
import WcIcon from '@mui/icons-material/Wc';
import CakeIcon from '@mui/icons-material/Cake';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScienceIcon from '@mui/icons-material/Science';
import CancelConfirmationDialog from '../../../Components/Dialogs/CancelConfirmationDialog/CancelConfirmationDialog';
import CancelSuccessDialog from '../../../Components/Dialogs/CancelSuccessDialog/CancelSuccessDialog';

const ReceptionPatientProfile = () => {
  const { id } = useParams();
  const [userData, setuserData] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [userError, setUserError] = useState('');
  const [appointmentError, setAppointmentError] = useState('');

  const [rawUser, setRawUser] = useState(null);

  useEffect(() => {
    setLoadingUser(true);
    setUserError('');
    getPatientProfileById(id).then((val) => {
      const userObject = val.data;
      setRawUser(userObject);
      const userDetailsArray = [
        { label: 'Name', value: userObject.name || 'N/A', icon: <PersonIcon fontSize='small' /> },
        { label: 'Gender', value: userObject.gender || 'N/A', icon: <WcIcon fontSize='small' /> },
        { label: 'DOB', value: userObject.dateOfBirth || 'N/A', icon: <CakeIcon fontSize='small' /> },
        { label: 'Occupation', value: userObject.occupation || 'N/A', icon: <WorkIcon fontSize='small' /> },
        { label: 'Email', value: userObject.email || 'N/A', icon: <EmailIcon fontSize='small' /> },
        { label: 'Phone', value: userObject.mobileNo || 'N/A', icon: <PhoneIcon fontSize='small' /> },
      ];
      setuserData(userDetailsArray);
      setLoadingUser(false);
    }).catch(() => {
      setUserError('Unable to load profile details.');
      setLoadingUser(false);
    });
  }, [id]);
  const [anchorEl, setAnchorEl] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [doctors, setDoctors] = useState('');
  const [openReceptionModal, setOpenReceptionModal] = useState(false);
  const [bookingMode, setBookingMode] = useState('');
  const [prevApptDetails, setPrevApptDetails] = useState([]);

  const doctorList = useSelector((state) => state.home.doctorList || []);
  const [searchDoctor, setSearchDoctor] = useState('');

  useEffect(() => {
    setDoctors(doctorList?.content);
  }, [doctorList]);

  const onCloseSlot = () => {
    setOpenReceptionModal(false);
    dispatch(clearReceptionCache());
  };
  const [pagination, setPagination] = useState({ page: 0, size: 5 });
  const [isSpinner, setSpinner] = useState(false);

  useEffect(() => {
    if (!openModal) return;

    const trimmedText = searchDoctor.trim();
    const doctorPayload = { pagination };

    const delayDebounce = setTimeout(() => {
      const fetchDoctors = async () => {
        setSpinner(true);

        try {
          if (trimmedText.length >= 3) {
            doctorPayload.data = { searchText: trimmedText };
          }
          await dispatch(fetchDoctorListThunk(doctorPayload)).unwrap();
        } catch (err) {
          console.error('Failed to fetch doctors:', err);
        } finally {
          setSpinner(false);
        }
      };

      fetchDoctors();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchDoctor, openModal, pagination, dispatch]);

  const onBookAppointment = () => {
    setOpenModal(true);
  };
  const handleClose = (index) => {
    fetchAppointments();
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

  const fetchAppointments = async () => {
    try {
      setAppointmentError('');
      setLoadingAppointments(true);
      const allAppointments = [];
      let currentPage = 0;
      let totalPages = 1;

      while (currentPage < totalPages) {
        const payload = { param: id, page: currentPage };
        const postsResponse = await getAllUserAppointment(payload);
        const data = postsResponse.data;
        const pageContent = data.content.map((item) => ({
          date: new Date(
            item.bookingDate + ' ' + item.timeFrom
          ).toLocaleString(),
          doctor: item.doctorName,
          specialty: item.categoryDetailName,
          qualifications: item.degree,
          location: 'Hebrew Clinic, Beach Road, Besant Nagar, Chennai',
          bookingId: item.rowId,
          ...item,
        }));

        allAppointments.push(...pageContent);
        totalPages = data.page.totalPages;
        currentPage += 1;
      }

      setAppointments(allAppointments);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAppointmentError('Unable to load appointments.');
    } finally {
      setLoadingAppointments(false);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  const [returnMessage, setReturnMessage] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);

  useEffect(() => {
    if (returnMessage) {
      setShowReturnModal(true);
    }
  }, [returnMessage]);

  const { appConfig } = useSelector((state) => state.auth);
  const [cancelConfirmationOpen, setCancelConfirmationOpen] = useState(false);
  const [cancelSuccessOpen, setCancelSuccessOpen] = useState(false);
  const [cancelApptData, setCancelApptData] = useState(null);

  const handleCancelAppointment = (appoinment) => {
    if (
      (appoinment.bookingStatus === 'B' || appoinment.bookingStatus === 'C') &&
      (appoinment.paymentMethod === 'Online Payment' ||
        appoinment.paymentMethod === null) &&
      appoinment.paymentStatus === null
    ) {
      setInfoModal(true);
      setInfoModalData('Payment Status is Empty.\nContact Admin');
      return;
    }
    setCancelApptData(appoinment);
    setCancelConfirmationOpen(true);
  };

  const handleConfirmCancel = () => {
    const appoinment = cancelApptData;
    const payload = {
      doctorId: appoinment.doctorId,
      regNo: appoinment.regNo,
      patientId: appoinment.regNo,
      date: appoinment.bookingDate,
      time: appoinment.timeFrom,
      hospitalId: appConfig.hospitalId,
      status: 'CANCELLED',
      bookingId: appoinment.bookingId,
    };

    cancelAppointment({ payload, param: appoinment.appointmentId }).then(() => {
      setCancelConfirmationOpen(false);
      setCancelSuccessOpen(true);
      fetchAppointments();
    });
  };

  const statusMap = {
    X: 'CANCELLED',
    C: 'CONFIRMED',
    B: 'BOOKED',
  };

  const statusColorMap = {
    X: '#E53935',
    C: '#04BA8E',
    B: '#FF9800',
  };

  const statusBgMap = {
    X: '#FFE5E5',
    C: '#E6F7F3',
    B: '#FFF3E0',
  };

  const [infoModal, setInfoModal] = useState(false);
  const [infoModalData, setInfoModalData] = useState('');
  const updatePaymentStatus = async (appt) => {
    const payload = {
      param: appt.appointmentId,
      payload: { paymentStatus: 'CASH_PAID',
        updatedBy:"user",
      },
    };
    
    try {
      const resultAction = await dispatch(updateCashPaymentStatusCall(payload)).unwrap();
      console.log(resultAction)
      setInfoModal(true);
      setInfoModalData(
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>
            <CheckCircleIcon
              color='success'
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Typography variant='h6'>Payment Status Updated.</Typography>
          </Box>
        </>
      );
    } catch (error) {
      setInfoModal(true);
      setInfoModalData(
        'Something went wrong while updating payment status.\nPlease contact the admin.'
      );
    }
  };

  const initials = rawUser?.name
    ? rawUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const upcomingCount = appointments.filter(
    (a) => a.bookingStatus !== 'X' && new Date(a.bookingDate) >= new Date().setHours(0, 0, 0, 0)
  ).length;

  return (
    <>
      <ReceptionHeader />

      <Modal open={showReturnModal} onClose={() => setShowReturnModal(false)}>
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
            width: 300,
            mx: 'auto',
            mt: '20vh',
            textAlign: 'center',

          }}
        >
          <IconButton
            onClick={() => {
              setShowReturnModal(false);
            }}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#04BA8E',
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant='body1' sx={{ mb: 2 }}>
            {returnMessage}
          </Typography>
          <Button variant='contained' onClick={() => setShowReturnModal(false)}>
            OK
          </Button>
        </Box>
      </Modal>
      <Spinner open={isSpinner} />
      <Modal
        open={infoModal}
        onClose={() => {
          setInfoModal(false);
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: '40vh',
            width: '40vw',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {' '}
          <IconButton
            onClick={() => setInfoModal(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>{' '}
          {infoModalData}
          <Button
            onClick={() => setInfoModal(false)}
            variant='contained'
            sx={{
              mt: 3,
              backgroundColor: '#04BA8E',
              color: '#fff',
              borderRadius: '8px',
              py: 2,
              width: '200px',
              '&:hover': {
                backgroundColor: '#04BA8E',
              },
            }}
          >
            Okay
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxHeight: '80%',
            overflow: 'auto',
            width: 450,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 6,
            alignSelf: 'center',
          }}
        >
          <Typography variant='h6'>Select a Doctor</Typography>
          <TextField
            label='Search Doctor'
            variant='outlined'
            fullWidth
            sx={{
              my: 2,
            }}
            value={searchDoctor}
            onChange={(e) => setSearchDoctor(e.target.value)}
          />
          {doctors &&
            doctors?.length > 0 &&
            doctors?.map((doctor) => (
              <Box key={doctor?.doctorId} sx={{ my: 1 }}>
                <Grid container spacing={2} alignItems='center' marginTop={1}>
                  <DoctorProfile name={doctor?.doctorName} />
                  <Button
                    variant='contained'
                    sx={{
                      height: 30,
                      width: '25%',
                      left: 40,
                      bottom: 20,
                    }}
                    onClick={() => {
                      setOpenModal(false);
                      setOpenReceptionModal(true);
                      setBookingMode('normal');
                      dispatch(updateSelectedDoctorRec(doctor));
                    }}
                  >
                    Book
                  </Button>
                </Grid>
              </Box>
            ))}
        </Box>
      </Modal>

      <Box>
        {openReceptionModal && (
          <ReceptionAppointmentModal
            open={openReceptionModal}
            onCloseSlot={onCloseSlot}
            userId={id}
            setReturnMessage={setReturnMessage}
            bookingMode={bookingMode}
            prevApptDetails={prevApptDetails}
          />
        )}
      </Box>

      <Box sx={{ backgroundColor: '#F5F7FA', minHeight: '100vh', pb: 6 }}>
        <Container>
          <Box sx={{ display: 'flex', alignItems: 'center', pt: 4, mb: 3 }}>
            <Button
              onClick={() => navigate('/reception/dashboard')}
              sx={{ minWidth: 'auto', mr: 1, color: '#2B2A29' }}
            >
              <ArrowBackIosIcon sx={{ fontSize: 20 }} />
            </Button>
            <Typography sx={{ fontWeight: 700, color: '#1A1A2E', fontSize: 26 }}>
              Patient Profile
            </Typography>
          </Box>

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
                    {rawUser?.name || 'Patient'}
                  </Typography>
                  <Typography sx={{ opacity: 0.85, mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 16 }} /> {rawUser?.mobileNo || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                  <Button
                    variant='contained'
                    onClick={onBookAppointment}
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
                    Book An Appointment
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

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
                    {upcomingCount}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Upcoming
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                onClick={() => navigate(`/recepetion/lab/reports/${id}`)}
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

          <Grid container spacing={3} alignItems='flex-start'>
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
                      {[...Array(6)].map((_, i) => (
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
                      All Appointments
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
                        <Grid container sx={{ px: 3, py: 2, bgcolor: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                          <Grid item xs={2}>
                            <Typography variant='caption' fontWeight={700} color='#666'>Date & Time</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant='caption' fontWeight={700} color='#666'>Doctor</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant='caption' fontWeight={700} color='#666'>Specialty</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant='caption' fontWeight={700} color='#666'>Payment</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant='caption' fontWeight={700} color='#666'>Status</Typography>
                          </Grid>
                          <Grid item xs={2} textAlign='center'>
                            <Typography variant='caption' fontWeight={700} color='#666'>Action</Typography>
                          </Grid>
                        </Grid>

                        {appointments.map((appt, index) => {
                          const statusVal = statusMap[appt.bookingStatus] || appt.bookingStatus;
                          const statusColor = statusColorMap[appt.bookingStatus] || '#666';
                          const statusBg = statusBgMap[appt.bookingStatus] || '#F5F5F5';
                          const isCancelled = appt.bookingStatus === 'X';
                          return (
                            <Box
                              key={`appt-${index}`}
                              sx={{
                                px: 3,
                                py: 2,
                                borderBottom: index < appointments.length - 1 ? '1px solid #F0F0F0' : 'none',
                                '&:hover': { bgcolor: '#FAFAFA' },
                                transition: 'background 0.2s',
                                opacity: isCancelled ? 0.6 : 1,
                              }}
                            >
                              <Grid container alignItems='center'>
                                <Grid item xs={2}>
                                  <Typography variant='body2' fontWeight={600} color='#2B2A29'>
                                    {appt.date}
                                  </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                  <Typography variant='body2' color='#333' fontWeight={500}>
                                    {appt.doctor}
                                  </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                  <Typography variant='body2' color='#666'>
                                    {appt.specialty}
                                  </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                  <Chip
                                    label={appt.paymentStatus || 'N/A'}
                                    size='small'
                                    variant='outlined'
                                    sx={{
                                      borderColor: appt.paymentStatus === 'Cash Paid' || appt.paymentStatus === 'CASH_PAID' ? '#04BA8E' : '#E0E0E0',
                                      color: appt.paymentStatus === 'Cash Paid' || appt.paymentStatus === 'CASH_PAID' ? '#04BA8E' : '#999',
                                      fontWeight: 500,
                                      fontSize: 11,
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={2}>
                                  <Chip
                                    label={statusVal}
                                    size='small'
                                    sx={{
                                      bgcolor: statusBg,
                                      color: statusColor,
                                      fontWeight: 600,
                                      fontSize: 11,
                                      height: 24,
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={2} textAlign='center'>
                                  {!isCancelled && (
                                    <IconButton size='small' onClick={(e) => handleClick(e, index)}>
                                      <MoreVertIcon />
                                    </IconButton>
                                  )}
                                  <Menu
                                    anchorEl={anchorEl[index]}
                                    open={Boolean(anchorEl[index])}
                                    onClose={() => handleClose(index)}
                                    anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                      vertical: 'top',
                                      horizontal: 'right',
                                    }}
                                    PaperProps={{
                                      sx: {
                                        borderRadius: 2,
                                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                        p: 1,
                                        minWidth: 200,
                                      },
                                    }}
                                  >
                                    {appt.bookingStatus !== '' &&
                                      appt.paymentStatus !== 'Cash Paid' &&
                                      appt.paymentStatus !== 'CASH_PAID' &&
                                      appt.paymentStatus !== 'Online Paid' &&
                                      appt.paymentStatus !== 'Refunded' && (
                                        <MenuItem
                                          onClick={() => {
                                            updatePaymentStatus(appt);
                                            handleClose(index);
                                          }}
                                          sx={{
                                            color: '#04BA8E',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            px: 2,
                                            py: 1,
                                            borderRadius: '6px',
                                            '&:hover': {
                                              backgroundColor: '#02bd8e58',
                                              color: '#2c6053ff',
                                            },
                                          }}
                                        >
                                          Mark as Cash Paid
                                        </MenuItem>
                                      )}
                                    {appt.bookingStatus !== 'X' &&
                                    new Date(appt.bookingDate) >=
                                      new Date().setHours(0, 0, 0, 0) ? (
                                      <MenuItem
                                        onClick={() => {
                                          setPrevApptDetails(appt);
                                          setBookingMode('modify');
                                          setOpenModal(false);
                                          setOpenReceptionModal(true);
                                          handleClose(index);
                                        }}
                                        sx={{
                                          color: '#04BA8E',
                                          fontSize: '14px',
                                          fontWeight: 500,
                                          px: 2,
                                          py: 1,
                                          borderRadius: '6px',
                                          '&:hover': {
                                            backgroundColor: '#02bd8e58',
                                            color: '#2c6053ff',
                                          },
                                        }}
                                      >
                                        Reschedule
                                      </MenuItem>
                                    ) : null}
                                    {appt.bookingStatus !== 'X' &&
                                      appt.paymentStatus !== 'Refunded' &&
                                      new Date(appt.bookingDate) >=
                                        new Date().setHours(0, 0, 0, 0) && (
                                        <MenuItem
                                          onClick={() => {
                                            handleCancelAppointment(appt);
                                            handleClose(index);
                                          }}
                                          sx={{
                                            color: '#FF2424',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            px: 2,
                                            py: 1,
                                            borderRadius: '6px',
                                            '&:hover': {
                                              backgroundColor: '#FFECEC',
                                              color: '#D8000C',
                                            },
                                          }}
                                        >
                                          Cancel
                                        </MenuItem>
                                      )}
                                  </Menu>
                                </Grid>
                              </Grid>
                            </Box>
                          );
                        })}
                      </Box>
                    ) : (
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <CalendarMonthIcon sx={{ fontSize: 48, color: '#E0E0E0', mb: 1 }} />
                        <Typography color='textSecondary'>No appointments found.</Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <CancelConfirmationDialog
        open={cancelConfirmationOpen}
        handleClose={() => setCancelConfirmationOpen(false)}
        cancelAppointmentData={cancelApptData}
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

export default ReceptionPatientProfile;
