import React, { useState, useEffect } from 'react';
import Header from '../../../Components/Header/header';
import TopNavbar from '../../../Components/TopNav/topNav';
import Banner from '../../../Components/Banner/Banner';
import {
  Box,
  Button,
  ButtonBase,
  Container,
  Grid,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CardActions,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';
import Diabatology from '../../../assets/Diabotology2.png';
import Neurology from '../../../assets/Neurology1.png';
import Odontology from '../../../assets/Ontology1.png';
import Pediatries from '../../../assets/Pediatries1.png';
import Gastroenterology from '../../../assets/Gastrology1.png';
import Dermatology from '../../../assets/Dermatology1.png';
import Nephrology from '../../../assets/NEPHROLOGY1.png';
import Oncology from '../../../assets/ONCOLOGY1.png';
import Appointment from '../../../assets/appointments.png';
import VisitHistory from '../../../assets/visitHistory.png';
import LabReports from '../../../assets/labReports.png';
import Notification from '../../../assets/notification.png';
import ProfileMapping from '../../../assets/profileMapping.png';
import Checkin from '../../../assets/checkin.png';
import { IconButton } from '@mui/material';
import DoctorsList from '../../../Components/DoctorsList/DoctorsList';
import Footer from '../../../Components/Footer/footer';
import WhyChooseUs from '../../../Components/whychoosUs/whychooseUs';
import { useNavigate } from 'react-router-dom';
import axios, { isCancel } from 'axios';
import { Card, CardContent } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserDetails,
  getUserAppointment,
  cancelAppointment,
  createOrder,
  paymentConfirmation,
  updatePaymentStatusAtHospital,
} from '../../../Services/PatientServices';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchDoctorListThunk } from '../../../Redux/Modules/Patient/HomeThunk';
import Chip from '@mui/material/Chip';
import CancelConfirmationDialog from '../../../Components/Dialogs/CancelConfirmationDialog/CancelConfirmationDialog';
import ReplayIcon from '@mui/icons-material/Replay';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CancelIcon from '@mui/icons-material/Cancel';
import CancelSuccessDialog from '../../../Components/Dialogs/CancelSuccessDialog/CancelSuccessDialog';
import AppoinmentDialog from '../../../Components/Dialogs/AppoinmentDialog/appoinmentDialog';
import { getDoctorAvailableDatesThunk } from '../../../Redux/Modules/Patient/HomeThunk';
import { updateSelectedDoctor, updateBackdrop } from '../../../Redux/Modules/Patient/HomeSlice';
import NoAppointments from '../../../Components/NoAppointments/noAppointments';
import AppoinmentUpdateDialog from '../../../Components/Dialogs/AppoinmentUpdateDialog/AppoinmentUpdateDialog';
import ErrorMessage from '../../../Components/ErrorMessage/errorMessage';
const loginMappings = [
  { label: 'Appointments', image: Appointment },
  { label: 'Visit History', image: VisitHistory },
  { label: 'Lab Reports', image: LabReports, url: '/patient/profile/labreport' },
  { label: 'Profile Mapping', image: ProfileMapping },
  { label: 'Check-In', image: Checkin },
  { label: 'Notifications', image: Notification },
];

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  padding: theme.spacing(3),
  backgroundColor: '#fff',
}));

// Array of service boxes with labels and images
const services = [
  { label: 'DIABETOLOGY', image: Diabatology },
  { label: 'NEUROLOGY', image: Neurology },
  { label: 'Odontology', image: Odontology },
  { label: 'Pediatrics', image: Pediatries },
  { label: 'GASTROENTOLOGY', image: Gastroenterology },
  { label: 'DERMATOLOGY', image: Dermatology },
  { label: 'NEPHROLOGY', image: Nephrology },
  { label: 'ONCOLOGY', image: Oncology },
];
const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [isCancelCoinfirmationDialog, setCancelCoinfirmationDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState({});
  const isCancelOpen = Boolean(anchorEl);
  const [cancelAppointmentData, setcancelAppointmentData] = useState([]);
  const [isCancelSuccessDialog, setCancelSuccessDialog] = useState(false);
  const navigate = useNavigate();
  const [isBookNowDialogOpen, setBookNowDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);

  const { doctorListError, doctorList, doctorListLoading, callAppointment } = useSelector(
    (state) => state.home
  );
  const { appConfig } = useSelector((state) => state.auth);

  const [isSearching, setSearching] = useState(false);
  const [selectedDocter, setSelectedDocter] = useState(null);
  const [isBookingSuccesOpen, setBookingSuccessOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 6 });
  const [searchText, setsearchText] = useState('');

  const [loadingAppointments, setLoadingAppointments] = useState(true); // added
  const [UpdateDialogMessage, setUpdateDialogMessage] = useState('');
  const dispatch = useDispatch();
  const handleButtonClick = (url) => {
    console.log(url, 'Url');
    navigate(url);
  };

  useEffect(() => {
    const trimmedText = searchText.trim();
    const doctorPayload = {
      pagination: pagination,
    };

    if (trimmedText.length >= 3) {
      doctorPayload.data = {
        searchText: trimmedText,
      };
    }

    dispatch(fetchDoctorListThunk(doctorPayload));
  }, [pagination.page, pagination.size, searchText]);

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  const handleSearch = (searchText) => {
    setsearchText(searchText);
  };

  const fetchUserDetails = async () => {
    const payload = { param: localStorage.getItem('regNo') };

    try {
      const response = await getUserDetails(payload);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const fetchAppointments = async () => {
    const payload = { param: localStorage.getItem('regNo') };

    try {
      const response = await getUserAppointment(payload);
      const appointmentsData = response?.data?.content.map((item) => ({
        date: formatDateTime(item.bookingDate, item.timeFrom),
        doctor: item.doctorName,
        specialty: item.categoryDetailName,
        qualifications: item.degree,
        location: 'Hebrew Clinic, Beach Road, Besant Nagar, Chennai',
        bookingId: item.appointmentId,
        ...item,
      }));
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  useEffect(() => {
    if (callAppointment) {
      window.scroll({
        top: window.innerHeight,
        behavior: 'smooth',
      });

      fetchAppointments();
    }
  }, [callAppointment]);

  // ✅ Initial load
  useEffect(() => {
    fetchUserDetails();
    fetchAppointments();
  }, []);

  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    let [hours, minutes] = timeStr ? timeStr.split(':') : ['00', '00'];
    let period = 'AM';
    hours = parseInt(hours, 10);

    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${formattedDate} at ${hours}:${minutes} ${period}`;
  };

  const handleClick = (event, index) => {
    setAnchorEl((prev) => ({
      ...prev,
      [index]: event.currentTarget,
    }));
  };

  const handleClose = (index) => {
    setAnchorEl((prev) => ({
      ...prev,
      [index]: null,
    }));
  };
  const handleCancelAppointment = (appoinment) => {
    dispatch(updateBackdrop(true));
    const payload = {
      doctorId: appoinment.doctorId,
      regNo: appoinment.regNo,
      patientId: appoinment.regNo,
      date: appoinment.bookingDate,
      time: appoinment.timeFrom,
      // hospitalId: appConfig.hospitalId,
      hospitalId:3,
      status: 'CANCELLED',
      bookingId: appoinment.appointmentId,
    };

    cancelAppointment({ payload, param: appoinment.appointmentId })
      .then((res) => {
        dispatch(updateBackdrop(false));
        setCancelSuccessDialog(true);
        handleClose();
      })
      .catch((err) => {
        dispatch(updateBackdrop(false));
        console.log(err, 'Erroro');
        setErrorOpen(true);
      });
  };

  const handleReschedule = (doctor) => {
    const { doctorId } = doctor;
    let payload = {
      doctorId,
    };
    setSelectedDocter(doctor);
    dispatch(updateSelectedDoctor(doctor));
    dispatch(getDoctorAvailableDatesThunk(payload));
    setBookNowDialogOpen(true);
  };

  const handlePayNow = (appoinment) => {
    const payload = { appointmentId: appoinment.appointmentId };
    createOrder(payload).then((res) => {
      console.log(res.data, 'Data');
      const { amount, currency, razorpayKey, orderId } = res.data;

      const onPaymentSuccess = (response) => {
        handlePaymentConfirmation(response, appoinment.appointmentId, razorpayKey, amount, currency);
      };

      const options = {
        key: razorpayKey, // Replace with your Razorpay Key ID
        amount: amount,
        currency: currency,
        order_id: orderId,
        handler: onPaymentSuccess,

        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: () => {
            console.log('🚪 User closed Razorpay popup');
            alert('Popup dismissed by user');
          },
        },
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        console.log(response, 'Response');
      });
      // const rzp = new window.Razorpay(options);
      rzp1.open();
    });
  };

  const handlePaymentConfirmation = (response, appointmentId, key, amount, currency) => {
    dispatch(updateBackdrop(true));
    console.log('Hiititng here');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
    console.log(appointmentId, key, 'bookedDoctorDetails');
    const payload = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointment_id: appointmentId,
      amount: amount,
      currency: currency,
      method: 'upi',
      key: key,
    };
    console.log('payLoad', payload);
    paymentConfirmation(payload).then((res) => {
      console.log(res, 'Repsoen');
      dispatch(updateBackdrop(false));
      setUpdateDialogMessage('Your appointment has been confirmed successfully.');
      setBookingSuccessOpen(true);
    }).catch((err) => {
      dispatch(updateBackdrop(false));
      console.log(err, 'ConfirmPayment Error');
      setError(err?.response?.data?.errorMessage || 'Payment confirmation failed');
      setErrorOpen(true);
    });
  };

  const handlePayAtHospital = (appoinment) => {
    console.log(appoinment);
    const payload = { param: appoinment.appointmentId };
    updatePaymentStatusAtHospital(payload).then((res) => {
      console.log(res, 'Response');
    });
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
    setError('');
  };
  return (
    <>
      <TopNavbar />
      <Header />
      <Banner userDetails={userDetails} setSearching={setSearching} handleSearch={handleSearch} />

      {isSearching && (
        <>
          {doctorListLoading && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px 0',
                }}
              >
                <CircularProgress color='inherit' />
              </Box>
            </>
          )}
          {!doctorListLoading && doctorList?.content?.length > 0 ? (
            <>
              <Box
                sx={{
                  backgroundColor: '#FBFBFB',
                  margin: '32px 0 0 0',
                  padding: '24px 0 0 0',
                }}
              >
                <Container>
                  <Typography variant='h6' sx={{ color: '#2B2A29', fontSize: 24 }}>
                    {doctorList.totalElements} Doctors available
                  </Typography>
                </Container>
              </Box>

              <DoctorsList
                // setLoginSignupDialogOpen={setLoginSignupDialogOpen}
                pagination={pagination}
                handlePageChange={handlePageChange}
                handleSizeChange={handleSizeChange}
              />
            </>
          ) : (
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              padding='64px 0'
              textAlign='center'
            >
              <LocalHospitalIcon sx={{ fontSize: 60, color: '#04BA8E', mb: 2 }} />

              <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#3c3c3c' }}>
                No doctors found for your seacrch
              </Typography>

              <Typography variant='body1' sx={{ color: '#666' }}>
                Search with doctor name or specialty
              </Typography>
            </Box>
          )}
        </>
      )}
      <Box
        sx={{
          backgroundColor: 'rgba(4, 186, 142, 0.2)', // #04BA8E with 20% opacity
          padding: '16px 0', // Padding of 20px at top and bottom
          overflow: 'hidden', // To contain the marquee effect
          whiteSpace: 'nowrap', // Prevent text wrapping
        }}
      >
        <Box
          sx={{
            display: 'inline-block',
            animation: 'marquee 10s linear infinite', // Marquee animation
          }}
        >
          <Typography variant='h6' sx={{ color: '#3A3737', fontSize: 24, lineHeight: '48px' }}>
            Why Doccure - Round-the-clock doctor availability - Broad range of Specialities Order
            medicines & tests online Digitised health records
          </Typography>
        </Box>
        <style>
          {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
        </style>
      </Box>
      {/* <PromotionCards /> */}
      <Container>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {loginMappings.map((service, index) => (
            <Grid item xs={12} sm={5} md={4} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 20px',
                  textAlign: 'center',
                  backgroundColor: '#04BA8E0A',
                  borderRadius: '8px',
                  border: '1px solid #04BA8E0A',
                  boxShadow: 1,
                  height: '200px', // Set the height of the box
                }}
              >
                <ButtonBase
                  disabled={!service.url}
                  onClick={() => {
                    handleButtonClick(service.url);
                  }}
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: '80px',
                    height: '118px',
                    width: '118px',
                    '&.Mui-disabled': {
                      opacity: 0.5, // dimmed look
                      cursor: 'not-allowed', // show not-allowed cursor
                      pointerEvents: 'auto', // ensure cursor style works
                    },
                  }}
                >
                  <img
                    src={service.image}
                    alt={service.label}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      objectFit: 'contain',
                    }}
                  />
                </ButtonBase>

                <Typography variant='h6' color={'#333333'} fontSize={18} fontWeight={400}>
                  {service.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container>
        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 6 }}>
          <Typography variant='h6' color={'#2B2A29'} fontSize={32} fontWeight={600}>
            Your{' '}
          </Typography>
          <Typography variant='h6' color={' #04BA8E'} fontSize={32} fontWeight={600}>
            &nbsp; Appointments
          </Typography>
        </Box>

        <Grid container spacing={5} sx={{ mt: 2 }}>
          {appointments.length > 0 ? (
            appointments.map((appt, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={`appointment-${index}`}>
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '12px',
                      boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {/* Left Green Border */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '5px',
                        bgcolor: (appt.bookingStatus === 'X' || appt.bookingStatus === 'C') ? '#BA1904' : '#04BA8E',
                        borderRadius: '3px 0 0 3px',
                      }}
                    />

                    <CardContent sx={{ position: 'relative', padding: '20px' }}>
                      {/* More Options Button */}
                      {appt.bookingStatus !== 'X' && (
                        <IconButton
                          sx={{ position: 'absolute', top: 10, right: 10 }}
                          size='small'
                          onClick={(event) => handleClick(event, index)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      )}

                      <Menu
                        id={`long-menu-${index}`}
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
                            minWidth: 220,
                          },
                        }}
                      >
                        {/* {appt.bookingStatus === 'P' } */}
                        {appt.bookingStatus === 'C' && (
                          <MenuItem
                            onClick={() => {
                              handleReschedule(appt);
                              handleClose(index);
                            }}
                            sx={{
                              px: 2,
                              py: 1,
                              '&:hover': {
                                bgcolor: '#E6F7F3',
                              },
                            }}
                          >
                            <ListItemIcon sx={{ color: '#04BA8E' }}>
                              <ReplayIcon fontSize='small' />
                            </ListItemIcon>
                            <ListItemText primary='Re-Schedule' sx={{ fontWeight: 500 }} />
                          </MenuItem>
                        )}
                        {appt.bookingStatus === 'B' && appt.paymentStatus === 'Pending' && (
                          <>
                            <MenuItem
                              onClick={() => {
                                handlePayNow(appt);
                                handleClose(index);
                              }}
                              sx={{
                                px: 2,
                                py: 1,
                                '&:hover': {
                                  bgcolor: '#E6F7F3',
                                },
                              }}
                            >
                              <ListItemIcon sx={{ color: '#04BA8E' }}>
                                <PaymentIcon fontSize='small' />
                              </ListItemIcon>
                              <ListItemText primary='Pay Now' sx={{ fontWeight: 500 }} />
                            </MenuItem>

                            {/* <MenuItem
                              onClick={() => handlePayAtHospital(appt)}
                              sx={{
                                px: 2,
                                py: 1,
                                '&:hover': {
                                  bgcolor: '#E6F7F3',
                                },
                              }}
                            >
                              <ListItemIcon sx={{ color: '#04BA8E' }}>
                                <LocalHospitalIcon fontSize='small' />
                              </ListItemIcon>
                              <ListItemText primary='Pay at Hospital' sx={{ fontWeight: 500 }} />
                            </MenuItem> */}
                          </>
                        )}

                        <Divider sx={{ my: 1 }} />

                        <MenuItem
                          // onClick={() => handleCancelAppointment(appt)}
                          onClick={() => {
                            handleClose(index);
                            setCancelCoinfirmationDialog(true);
                            setcancelAppointmentData(appt);
                          }}
                          sx={{
                            px: 2,
                            py: 1,
                            color: '#FF2424',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            '&:hover': {
                              bgcolor: '#FFF5F5',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ color: '#E53935', minWidth: '36px' }}>
                            <CancelIcon fontSize='small' />
                          </ListItemIcon>
                          <ListItemText primary='Cancel Appointment' />
                        </MenuItem>
                      </Menu>
                      {/* Appointment Time */}
                      {(appt.bookingStatus === 'X' || appt.bookingStatus === 'C') ? (
                        <>
                          <Chip
                            label='Cancelled'
                            sx={{
                              border: '1px solid #FF95954D',
                              color: '#FF0000B2',
                              bgcolor: '#FF95951A',
                            }}
                          />
                        </>
                      ) : (
                        <Box display='flex' alignItems='center' gap={1}>
                          <AccessTimeIcon fontSize='small' sx={{ color: '#666' }} />
                          <Typography variant='body2' color='text.secondary'>
                            {appt.date}
                          </Typography>
                        </Box>
                      )}

                      {/* Doctor Name */}
                      <Typography variant='h6' fontWeight='bold' sx={{ mt: 1 }}>
                        {appt.doctor}
                      </Typography>

                      {/* Specialty */}
                      <Typography variant='body2' color='text.secondary'>
                        {appt.specialty}
                      </Typography>

                      {/* Qualifications */}
                      <Box display='flex' alignItems='center' gap={1} sx={{ mt: 1 }}>
                        <SchoolIcon fontSize='small' sx={{ color: '#666' }} />
                        <Typography variant='body2'>{appt.qualifications}</Typography>
                      </Box>

                      {/* Location */}
                      {/* <Box display='flex' alignItems='center' gap={1} sx={{ mt: 1 }}>
                        <LocationOnIcon fontSize='small' sx={{ color: '#666' }} />
                        <Typography variant='body2'>{appt.location}</Typography>
                      </Box> */}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <NoAppointments />
            </Grid>
          )}
        </Grid>
      </Container>

      <div id='doctors-section'>
        <Container sx={{ mt: 5 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              padding: { xs: '8px 16px', sm: '16px 24px' },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            {/* Left side - Title and description */}
            <Box sx={{ marginBottom: { xs: '12px', sm: 0 } }}>
              {' '}
              {/* Space for mobile only */}
              <Typography
                variant='h6'
                component='div'
                sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
              >
                Doctors
              </Typography>
              <Typography
                variant='body2'
                color='textSecondary'
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                Our team of experienced doctors are here to serve you
              </Typography>
            </Box>
          </Box>
        </Container>
        <DoctorsList
        // setLoginSignupDialogOpen={setLoginSignupDialogOpen}
        pagination={pagination}
        handlePageChange={handlePageChange}
        handleSizeChange={handleSizeChange}
      />
      </div>

      {/* <PromotionCards /> */}
      <Container id='department-section'>
        <HeaderContainer>
          <Typography
            variant='h4'
            align='center'
            sx={{
              color: '#2B2A29',
              fontSize: '32px',
              mt: 4,
            }}
          >
            Urgent Care & Occupational Medicine Clinic
          </Typography>
        </HeaderContainer>

        <Grid container spacing={3} justifyContent='center' padding={3}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 20px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(4, 186, 142, 0.04)',
                  borderRadius: '8px',
                  border: '1px solid rgba(4, 186, 142, 0.04)',
                  boxShadow: 3,
                  height: '300px', // Set the height of the box
                  color: '#333333',
                  textTransform: 'capitalize',
                }}
              >
                <img
                  src={service.image}
                  alt={service.label}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: '150px',
                    marginBottom: '16px',
                    borderRadius: '8px',
                    objectFit: 'contain',
                  }}
                />
                <Typography variant='h6'>{service.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
      <div id='about-section'>
        <WhyChooseUs />
      </div>
      <Footer />

      {isCancelCoinfirmationDialog && (
        <CancelConfirmationDialog
          open={isCancelCoinfirmationDialog}
          handleClose={() => {
            setCancelCoinfirmationDialog(false);
          }}
          cancelAppointmentData={cancelAppointmentData}
          handleConfirm={() => {
            setCancelCoinfirmationDialog(false);
            handleCancelAppointment(cancelAppointmentData);
          }}
        />
      )}

      {isCancelSuccessDialog && (
        <CancelSuccessDialog
          open={isCancelSuccessDialog}
          handleClose={() => {
            setCancelSuccessDialog(false);
            fetchAppointments();
          }}
        />
      )}

      <AppoinmentDialog
        open={isBookNowDialogOpen}
        onClose={() => {
          setBookNowDialogOpen(false);
        }}
        status='RESCHEDULE'
        paymentSuccess={() => {
          setUpdateDialogMessage();
          setBookNowDialogOpen(false);
          setUpdateDialogMessage('Your appointment has been rescheduled successfully.');
          setBookingSuccessOpen(true);
        }}
        selectedDocter={selectedDocter}
      />

      <AppoinmentUpdateDialog
        open={isBookingSuccesOpen}
        message={UpdateDialogMessage}
        onClose={() => {
          setBookingSuccessOpen(false);
          fetchAppointments();
        }}
      />
      <ErrorMessage
        message={error}
        open={errorOpen}
        onClose={handleErrorClose}
        variant='dialog' // or "dialog"
      />
    </>
  );
};

export default PatientDashboard;
