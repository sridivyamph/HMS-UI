import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Link,
  TextField,
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
import { getPatientProfileById, getUserAppointment } from '../../../Services/PatientServices';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import EditProfileDialog from '../../../Components/Dialogs/EditPatientProfileDialog/EditPatientProfileDialog';
const Profile = () => {
  const [userData, setuserData] = useState([]);
  const [anchorEl, setAnchorEl] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [prescription, setPrescriptionText] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // added
  const [loadingAppointments, setLoadingAppointments] = useState(true); // added
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    dob: '',
    email: '',
    gender: '',
  });

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
    getPatientProfileById(userId)
      .then((val) => {
        const userObject = val.data;
        setRawUser(userObject);

        const age = calculateAge(userObject.dateOfBirth);

        const userDetailsArray = [
          { label: 'Name', value: userObject.name || 'N/A' },
          { label: 'Gender', value: userObject.gender || 'N/A' },
          { label: 'Age', value: age },
          // { label: 'Occupation', value: userObject.occupation || 'N/A' },
          { label: 'Email', value: userObject.email || 'N/A' },
          { label: 'Phone', value: userObject.mobileNo || 'N/A' },
        ];
        setuserData(userDetailsArray);
      })
      .finally(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);
  const fetchAppointments = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const formatAppointmentDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      // timeStyle: "short",
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

  const handleEditSubmit = (updatedData) => {
    const regNo = localStorage.getItem('regNo');
    dispatch(updatePatientDetailsThunk({ param: regNo, payload: updatedData }))
      .unwrap()
      .then(() => {
        getPatientProfileById(regNo).then((val) => {
          const userObject = val.data;
          setRawUser(userObject);
          const age = calculateAge(userObject.dateOfBirth);
          setuserData([
            { label: 'Name', value: userObject.name || 'N/A' },
            { label: 'Gender', value: userObject.gender || 'N/A' },
            { label: 'Age', value: age },
            { label: 'Email', value: userObject.email || 'N/A' },
            { label: 'Phone', value: userObject.mobileNo || 'N/A' },
          ]);
        });
      })
      .catch((err) => {
        console.error('Failed to update profile:', err);
      });
  };
  return (
    <>
      <TopNavbar />
      <Header />
      <Box
        sx={{
          backgroundColor: '#F9F9F9',
          mb: 6,
        }}
      >
        <Container>
          <Box sx={{ display: 'flex', pt: 6 }}>
            <Button
              onClick={() => {
                navigate('/patient/dashboard');
              }}
            >
              <ArrowBackIosIcon
                sx={{
                  marginLeft: '4px',
                  color: '#2B2A29',
                  fontSize: 24,
                }}
              />{' '}
              <Typography sx={{ fontWeight: 600, color: '#2B2A29', fontSize: 24 }}>
                My Profile
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
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 2,
                    }}
                  >
                    <Avatar
                      src='https://via.placeholder.com/150'
                      alt='User Avatar'
                      sx={{ width: 110, height: 110 }}
                    />

                    <Button
                      endIcon={<EditIcon />}
                      onClick={() => {
                        setEditForm({
                          name: rawUser?.name || '',
                          dob: rawUser?.dateOfBirth || '',
                          email: rawUser?.email || '',
                          gender: rawUser?.gender || '',
                        });
                        setEditOpen(true);
                      }}
                      sx={{
                        textTransform: 'none',
                        color: '#04BA8E',
                        fontWeight: 'bold',
                        fontSize: 16,
                        cursor: 'pointer',
                        ml: 2,
                      }}
                    >
                      Profile
                    </Button>
                  </Box>

                  {/* User Details */}
                  <Box sx={{ mt: 2, textAlign: 'left' }}>
                    {loadingUser ? (
                      <>
                        {[...Array(6)].map((_, index) => (
                          <Box sx={{ pt: 2 }} key={index}>
                            <Skeleton variant='text' width='60%' height={20} />
                            <Skeleton variant='text' width='80%' height={20} sx={{ mt: 1 }} />
                          </Box>
                        ))}
                      </>
                    ) : (
                      userData.map((item, index) => (
                        <Box sx={{ pt: 2 }} key={item.label + index}>
                          <Typography
                            variant='body1'
                            sx={{ fontSize: 16, fontWeight: 500 }}
                            color='#6E6E6E'
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            variant='body1'
                            color='#2B2A29'
                            sx={{ fontSize: 16, fontWeight: 500, pt: 1 }}
                          >
                            {item.value}
                          </Typography>
                        </Box>
                      ))
                    )}
                  </Box>

                  {/* Lab Reports Link */}
                  <Box
                    onClick={() => {
                      navigate('/patient/profile/labreport');
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
            <Grid item xs={9}>
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  py: '40px',
                  px: '20px',
                }}
              >
                <Accordion
                  // key={idx}
                  sx={{
                    mb: 2,
                    backgroundColor: '#04BA8E0A',
                    borderRadius: 1,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#04BA8E' }} />}
                    sx={{
                      fontWeight: 'bold',
                      color: '#444444',
                      fontSize: 16,
                    }}
                  >
                    Visit Information
                  </AccordionSummary>
                  <AccordionDetails>
                    {loadingAppointments ? (
                      <Grid container spacing={2} sx={{ py: 2, px: 2 }}>
                        {[...Array(3)].map((_, index) => (
                          <React.Fragment key={index}>
                            <Grid item xs={3}>
                              <Skeleton variant='text' width='100%' />
                            </Grid>
                            <Grid item xs={4}>
                              <Skeleton variant='text' width='100%' />
                            </Grid>
                            <Grid item xs={4}>
                              <Skeleton variant='text' width='100%' />
                            </Grid>
                            <Grid item xs={1}>
                              <Skeleton variant='circular' width={24} height={24} />
                            </Grid>
                          </React.Fragment>
                        ))}
                      </Grid>
                    ) : appointments.length > 0 ? (
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          py: 2,
                          px: 2,
                          backgroundColor: '#fff',
                          // textAlign: 'center', // 🔹 Center align all grid items
                        }}
                      >
                        {/* {section.title === "Visit Information" ? ( */}
                        <>
                          <Grid item xs={3}>
                            <Typography variant='subtitle2'>Date of Visit</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant='subtitle2'>Reason for Visit</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant='subtitle2'>Prescription</Typography>
                          </Grid>
                          <Grid item xs={1}>
                            {/* <Typography variant='subtitle2'>Prescription</Typography> */}
                          </Grid>
                          {appointments.map((visit, index) => (
                            <React.Fragment key={index}>
                              <Grid item xs={3}>
                                {formatAppointmentDate(visit.bookingDate)}
                              </Grid>
                              <Grid item xs={4}>
                                {visit.reasonForVisit}
                              </Grid>
                              <Grid item xs={4}>
                                {visit.prescription ? (
                                  <Box display='flex' gap={0.5}>
                                    <Typography
                                      color='primary'
                                      sx={{
                                        color: '#2B2A29',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                      }}
                                    >
                                      {visit.prescription}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Typography color='textSecondary'>No prescription</Typography>
                                )}
                              </Grid>
                              <Grid item xs={1}>
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
                                        borderRadius: '6px',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                          backgroundColor: '#FFECEC',
                                          color: '#D8000C',
                                        },
                                      }}
                                    >
                                      View Prescription
                                    </MenuItem>
                                  )}
                                </Menu>
                              </Grid>
                            </React.Fragment>
                          ))}
                        </>
                      </Grid>
                    ) : (
                      <Typography variant='body2' color='textSecondary'>
                        No records available.
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
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
          {/* Header */}
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
            <Typography variant='h6' fontWeight={600}>
              View Prescription
            </Typography>
            <IconButton onClick={() => setPrescriptionModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Patient Information Card */}
          {selectedAppointment && (
            <Box
              sx={{
                bgcolor: '#F9FAFA',
                borderRadius: 2,
                p: 2,
                mb: 3,
              }}
            >
              <Typography variant='subtitle2' color='textSecondary' mb={1}>
                Patient Information
              </Typography>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6} alignItems='center' gap={1}>
                  <Typography fontWeight={600}>{selectedAppointment.patientName}</Typography>
                  <Typography color='textSecondary' sx={{ mt: 2 }}>
                    {selectedAppointment.reasonForVisit}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} display='flex' alignItems='center' gap={1}>
                  <AccessTimeIcon fontSize='small' color='action' />
                  <Typography variant='body2'>
                    {formatAppointmentDate(selectedAppointment.date)} at{' '}
                    {selectedAppointment.appointmentTime}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Prescription Input */}
          <Box mb={3}>
            <Typography variant='subtitle2' color='textSecondary' mb={1}>
              Prescription
            </Typography>
            <TextField
              placeholder='Add Prescription'
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
        </Box>
      </Modal>
      <EditProfileDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={editForm}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};

export default Profile;
