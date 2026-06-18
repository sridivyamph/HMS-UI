import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Link,
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
const ReceptionPatientProfile = () => {
  const { id } = useParams();
  const [userData, setuserData] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getPatientProfileById(id).then((val) => {
      const userObject = val.data;
      const userDetailsArray = [
        { label: 'Name', value: userObject.name || 'N/A' },
        { label: 'Gender', value: userObject.gender || 'N/A' },
        { label: 'DOB', value: userObject.dateOfBirth || 'N/A' },
        { label: 'Occupation', value: userObject.occupation || 'N/A' },
        { label: 'Email', value: userObject.email || 'N/A' },
        { label: 'Phone', value: userObject.mobileNo || 'N/A' },
      ];
      setuserData(userDetailsArray);
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

  // const { selectedDoctorRec } = useSelector((state) => state.reception);
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
      setInfoModal(true);
      fetchAppointments();
      setInfoModalData(
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>
            <CheckCircleIcon
              color='success'
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Typography variant='h6'>Appointment Cancelled.</Typography>
          </Box>
        </>
      );
    });
  };

  const statusMap = {
    X: 'CANCELLED',
    C: 'CONFIRMED',
    B: 'BOOKED',
    // P: "PENDING",
  };
  const [infoModal, setInfoModal] = useState(false);
  const [infoModalData, setInfoModalData] = useState('');
  const updatePaymentStatus = async (appt) => {
    const payload = {
      param: appt.appointmentId,
      payload: { paymentStatus: 'CASH_PAID' },
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
      {/* Header */}

      {/* Doctor Search */}
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
              fontFamily: "'Albert Sans', sans-serif",
              fontWeight: 500,
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
                      fontFamily: "'Albert Sans', sans-serif",
                      fontWeight: 500,
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
      {/* not common */}
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
      <Box
        sx={{
          backgroundColor: '#F9F9F9',
          mb: 2,
        }}
      >
        <Container>
          {/* common change navigate */}
          <Box sx={{ display: 'flex', pt: 6 }}>
            <Button
              onClick={() => {
                navigate('/reception/dashboard');
              }}
            >
              <ArrowBackIosIcon
                sx={{
                  marginLeft: '4px',
                  color: '#2B2A29',
                  fontSize: 24,
                }}
              />{' '}
              <Typography
                sx={{
                  fontFamily: "'Albert Sans', sans-serif",
                  fontWeight: 600, // SemiBold weight
                  fontStyle: 'normal',
                  fontSize: 24,
                  lineHeight: '140%', // 140% line height
                  letterSpacing: '-2%',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  color: '#2B2A29',
                }}
              >
                Patient Profile
              </Typography>
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={3}>
              <Card
                sx={{
                  borderRadius: '4px',
                  backgroundColor: '#04BA8E05',
                  border: '1px solid #04BA8E05',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar
                    key={1}
                    src='https://via.placeholder.com/150'
                    alt='Don Crumb'
                    sx={{ width: 110, height: 110, mx: 'auto', mb: 2 }}
                  />

                  {/* User Details */}
                  <Box sx={{ mt: 2, textAlign: 'left' }}>
                    {userData.map(
                      (item) =>
                        item.value !== 'N/A' && (
                          <Box sx={{ pt: 2 }} key={item.label}>
                            <Typography
                              // key={index}//index is causing issues with the key prop of not  being unique
                              variant='body1'
                              sx={{
                                fontFamily: "'Albert Sans', sans-serif",
                                fontWeight: 500, // Medium weight
                                fontStyle: 'normal',
                                fontSize: 16,
                                lineHeight: '24px',
                                letterSpacing: 0,
                              }}
                              color='#6E6E6E'
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              // key={index}
                              variant='body1'
                              color='#2B2A29'
                              sx={{
                                fontFamily: "'Albert Sans', sans-serif",
                                fontWeight: 500, // Medium
                                fontStyle: 'normal',
                                fontSize: '18px',
                                lineHeight: '28px',
                                letterSpacing: 0,
                                pt: 1,
                              }}
                            >
                              {item.value}
                            </Typography>
                          </Box>
                        )
                    )}
                  </Box>
                  {/* common */}
                  {/* Lab Reports Link */}
                  <Box
                    onClick={() => {
                      navigate(`/recepetion/lab/reports/${id}`);
                    }}
                    sx={{
                      mt: 3,
                      display: 'flex',
                      alignItems: 'center',
                      color: '#04BA8E',
                      fontWeight: 'bold',
                      fontSize: 16,
                      cursor: 'pointer',
                    }}
                  >
                    Lab Reports
                    <ArrowForwardIosIcon
                      sx={{
                        marginLeft: '4px',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* common */}
            <Grid item xs={9}>
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  py: '40px',
                  px: '24px',
                  overflowX: 'auto',
                }}
              >
                {/* not common extra in reception  */}
                <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                  <Grid item xs={6} display='flex' justifyContent='flex-start'>
                    <Button
                      sx={{
                        backgroundColor: '#04BA8E',
                        color: '#ffffff',
                        minWidth: 180,
                        width: 300,
                        fontFamily: "'Albert Sans', sans-serif",
                        fontWeight: 600,
                        fontStyle: 'normal',
                        fontSize: '18px',
                        lineHeight: '28px',
                        letterSpacing: 0,
                        '&:hover': { backgroundColor: '#039b78' },
                      }}
                      onClick={() => {
                        onBookAppointment();
                      }}
                    >
                      Book An Appointment
                    </Button>
                  </Grid>
                  <Grid item xs={6} display='flex' justifyContent='flex-end'>
                    <Button
                      sx={{
                        backgroundColor: '#ffffff',
                        color: '#04BA8E',
                        minWidth: 180,
                        width: 300,
                        fontFamily: "'Albert Sans', sans-serif",
                        fontWeight: 600,
                        fontStyle: 'normal',
                        fontSize: '18px',
                        lineHeight: '28px',
                        letterSpacing: 0,
                        border: '1.5px solid #04BA8E',
                        '&:hover': { backgroundColor: '#f2f2f2' },
                      }}
                      onClick={() => {
                        navigate(`/recepetion/lab/reports/${id}`);
                      }}
                    >
                      See Lab Reports
                    </Button>
                  </Grid>
                </Grid>
                {/* 
                <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                  <Grid item xs={6} display="flex" justifyContent="flex-start">
                    <Button
                      sx={{
                        backgroundColor: "#04BA8E",
                        color: "#ffffff",
                        minWidth: 180,
                        width: 300,
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#039b78" },
                      }}
                      onClick={() => {
                        onBookAppointment();
                      }}
                    >
                      Book An Appointment
                    </Button>
                  </Grid>
                  <Grid item xs={6} display="flex" justifyContent="flex-end">
                    <Button
                      sx={{
                        backgroundColor: "#ffffff",
                        color: "#04BA8E",
                        minWidth: 180,
                        width: 300,
                        fontWeight: "bold",
                        border: "1.5px solid #04BA8E",
                        "&:hover": { backgroundColor: "#f2f2f2" },
                      }}
                      onClick={() => {
                        navigate("/labReports");
                      }}
                    >
                      See Lab Reports
                    </Button>
                  </Grid>
                </Grid> */}

                {/* common l 254 */}
                {/* Visit Information in Accordion */}
                {[
                  {
                    title: 'Visit Information',
                    data: [
                      {
                        date: '21 Nov',
                        reason: 'Cold',
                        prescription: '21doncrumb.pdf',
                      },
                      {
                        date: '19 Nov',
                        reason: 'Fever',
                        prescription: '19doncrumb.pdf',
                      },
                      {
                        date: '17 Nov',
                        reason: 'Fever',
                        prescription: '17doncrumb.pdf',
                      },
                    ],
                  },
                ].map((section, idx) => (
                  <Accordion
                    key={idx}
                    sx={{
                      mb: 2,
                      backgroundColor: '#04BA8E0A',
                      borderRadius: 1,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#04BA8E' }} />}
                      sx={{
                        fontFamily: "'Albert Sans', sans-serif",
                        fontWeight: 600, // SemiBold
                        fontStyle: 'normal',
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: 0,
                        color: '#444444',
                      }}
                    >
                      {section.title}
                    </AccordionSummary>
                    <AccordionDetails>
                      {section.data.length > 0 ? (
                        <Grid
                          container
                          spacing={1}
                          backgroundColor='#fff'
                          sx={{ py: 2, px: 2 }}
                        >
                          {section.title === 'Visit Information' ? (
                            <>
                              <Grid item xs={4} textAlign={'center'}>
                                <Typography variant='subtitle2'>
                                  Date of Visit
                                </Typography>
                              </Grid>
                              <Grid item xs={4} textAlign={'center'}>
                                <Typography variant='subtitle2'>
                                  Reason for Visit
                                </Typography>
                              </Grid>
                              <Grid item xs={4} textAlign={'center'}>
                                <Typography variant='subtitle2'>
                                  Prescription
                                </Typography>
                              </Grid>
                              {section.data.map((visit, index) => (
                                <React.Fragment key={index}>
                                  <Grid item xs={4} textAlign={'center'}>
                                    {visit.date}
                                  </Grid>
                                  <Grid item xs={4} textAlign={'center'}>
                                    {visit.reason}
                                  </Grid>
                                  <Grid item xs={4} textAlign={'center'}>
                                    <Link href='#' color='primary'>
                                      {visit.prescription}
                                    </Link>
                                  </Grid>
                                </React.Fragment>
                              ))}
                            </>
                          ) : (
                            <>
                              <Grid item xs={4} textAlign={'center'}>
                                <Typography variant='subtitle2'>
                                  Condition
                                </Typography>
                              </Grid>
                              <Grid item xs={4} textAlign={'center'}>
                                <Typography variant='subtitle2'>
                                  Date
                                </Typography>
                              </Grid>
                              <Grid item xs={4} textAlign={'center'}>
                                <Typography variant='subtitle2'>
                                  Treatment
                                </Typography>
                              </Grid>
                              {section.data.map((record, index) => (
                                <React.Fragment key={index}>
                                  <Grid item xs={4} textAlign={'center'}>
                                    {record.condition}
                                  </Grid>
                                  <Grid item xs={4} textAlign={'center'}>
                                    {record.date}
                                  </Grid>
                                  <Grid item xs={4} textAlign={'center'}>
                                    {record.treatment}
                                  </Grid>
                                </React.Fragment>
                              ))}
                            </>
                          )}
                        </Grid>
                      ) : (
                        <Typography variant='body2' color='textSecondary'>
                          No records available.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#04BA8E' }} />}
                      sx={{
                        fontFamily: "'Albert Sans', sans-serif",
                        fontWeight: 600, // SemiBold
                        fontStyle: 'normal',
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: 0,
                        color: '#444444',
                      }}
                    >
                      All Appointments
                    </AccordionSummary>
                    <AccordionDetails>
                      {appointments.length > 0 ? (
                        <Grid container spacing={1} backgroundColor='#fff' sx={{ py: 2, px: 2 }}>
                          {/* Header Row */}
                          <Grid item xs={2} textAlign='center'>
                            <Typography variant='subtitle2'>Date & Time</Typography>
                          </Grid>
                          <Grid item xs={2} textAlign='center'>
                            <Typography variant='subtitle2'>Doctor</Typography>
                          </Grid>
                          <Grid item xs={3} textAlign='center'>
                            <Typography variant='subtitle2'>Specialty</Typography>
                          </Grid>
                          <Grid item xs={2} textAlign='center'>
                            <Typography variant='subtitle2'>
                              PaymentStatus
                            </Typography>
                          </Grid>
                          <Grid item xs={2} textAlign='center'>
                            <Typography variant='subtitle2'>Status</Typography>
                          </Grid>
                          <Grid item xs={1} textAlign='center'>
                            <Typography variant='subtitle2'>Action</Typography>
                          </Grid>

                          {/* Appointment Rows */}
                          {appointments.map((appt, index) => (
                            <React.Fragment key={`appt-${index}`}>
                              <Grid item xs={2} textAlign='center'>
                                {appt.date}
                              </Grid>
                              <Grid item xs={2} textAlign='center'>
                                {appt.doctor}
                              </Grid>
                              <Grid item xs={3} textAlign='center'>
                                {appt.specialty}
                              </Grid>
                              <Grid item xs={2} textAlign='center'>
                                {appt.paymentStatus}
                              </Grid>
                              <Grid item xs={2} textAlign='center'>
                                {statusMap[appt.bookingStatus]}
                              </Grid>
                              <Grid item xs={1} textAlign='center'>
                                <IconButton size='small' onClick={(e) => handleClick(e, index)}>
                                  <MoreVertIcon />
                                </IconButton>
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
                                >
                                  {/* {appt.bookingStatus !== 'C' &&
                                    appt.bookingStatus !== 'X' &&
                                    appt.paymentMethod === 'Online Payment' &&
                                    appt.paymentStatus === 'Pending' && (
                                      <MenuItem
                                        onClick={() => {
                                          setInfoModal(true);
                                          setInfoModalData(
                                            'Mode of Payment is Online.\nPay through Patient Account.'
                                          );
                                          handleClose(index);
                                        }}
                                        sx={{
                                          color: '#04BA8E',
                                          fontSize: '14px',
                                          fontWeight: 500,
                                          px: 2,
                                          py: 1,
                                          borderRadius: '6px',
                                          transition: 'all 0.2s ease-in-out',
                                          '&:hover': {
                                            backgroundColor: '#02bd8e58',
                                            color: '#2c6053ff',
                                          },
                                        }}
                                      >
                                        Online Payment
                                      </MenuItem>
                                    )} */}
                                  {appt.bookingStatus !== 'C' &&
                                    appt.bookingStatus !== 'X' &&
                                    appt.paymentMethod !== 'Online Payment' && (
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
                                          transition: 'all 0.2s ease-in-out',
                                          '&:hover': {
                                            backgroundColor: '#02bd8e58',
                                            color: '#2c6053ff',
                                          },
                                        }}
                                      >
                                        Update Payment
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
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                          backgroundColor: '#02bd8e58',
                                          color: '#2c6053ff',
                                        },
                                      }}
                                    >
                                      Reschedule
                                    </MenuItem>
                                  ) : (
                                    <MenuItem
                                      sx={{
                                        color: '#04BA8E',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        px: 2,
                                        py: 1,
                                        borderRadius: '6px',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                          backgroundColor: '#02bd8e58',
                                          color: '#2c6053ff',
                                        },
                                      }}
                                    >
                                      No Action
                                    </MenuItem>
                                  )}
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
                                          transition: 'all 0.2s ease-in-out',
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
                            </React.Fragment>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant='body2' color='textSecondary'>
                          No upcoming appointments.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* <Footer /> */}
    </>
  );
};

export default ReceptionPatientProfile;
