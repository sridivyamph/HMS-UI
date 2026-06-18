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
  AppBar,
  Toolbar,
  IconButton,
  Modal,
  Menu,
  MenuItem,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useState, useEffect } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Logo from '../../../assets/Logo.svg';
import DocHeader from '../../../Components/Header/DocHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getPatientProfileById,
  getUserAppointment,
  cancelAppointment,
  updatePatientProfile,
} from '../../../Services/PatientServices';
import { updatePatientPrescription } from '../../../Services/DoctorServices';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ViewPatientProfile = () => {
  const { userId } = useParams();
  const [userData, setuserData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [prescription, setPrescriptionText] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const doctorResponse = useSelector((state) => state.doctor);
  const docName = doctorResponse.doctorData.doctorName;
  // const [updatedMedicalData,setUpdateMedicaldata] = useState([]);
  const [userallData, setuserallData] = useState([]);
  useEffect(() => {
    getPatientProfileById(userId).then((val) => {
      console.log(val.data, 'Value');
      const userObject = val.data;
      console.log(userObject, 'userObject');
      const userDetailsArray = [
        { label: 'Name', value: userObject.name || 'N/A' },
        { label: 'Gender', value: userObject.gender || 'N/A' },
        { label: 'DOB', value: userObject.dateOfBirth || 'N/A' },
        { label: 'Occupation', value: userObject.occupation || 'N/A' },
        { label: 'Email', value: userObject.email || 'N/A' },
        { label: 'Phone', value: userObject.mobileNo || 'N/A' },
      ];
      setuserData(userDetailsArray);
      setuserallData(userObject);
    });
  }, []);
  const [anchorEl, setAnchorEl] = useState({});
  const navigate = useNavigate();

  // present there
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

  const medicalData = [
    { section: 'Past Medical History', records: ['No significant history'] },
    { section: 'Surgical History', records: ['No records available'] },
    { section: 'Allergies', records: ['Penicillin'] },
    { section: 'Medication', records: ['Aspirin'] },
    { section: 'Immunization History', records: ['Not provided'] },
    { section: 'Lifestyle Factors', records: ['Occupation: Actor'] },
    {
      section: 'Chronic Condition',
      records: ['No chronic conditions reported'],
    },
    {
      section: 'Recent Symptoms and Complaints',
      records: ['No complaints reported'],
    },
    {
      section: 'Laboratory and Diagnostics',
      records: ['No records available'],
    },
  ];

  const sectionToFieldMap = {
    'Past Medical History': userallData.medicalHistory,
    'Surgical History': 'No surgical history provided',
    Allergies: userallData.allergies,
    Medication: userallData.medications,
    'Immunization History': 'No immunization data',
    'Lifestyle Factors': `Occupation: ${userallData.occupation}`,
    'Chronic Condition': 'No chronic conditions reported',
    'Recent Symptoms and Complaints': 'No recent symptoms reported',
    'Laboratory and Diagnostics': 'No diagnostics available',
  };

  const updatedMedicalData = medicalData.map((item) => ({
    section: item.section,
    records: [sectionToFieldMap[item.section] || 'Not Available'],
  }));
  console.log(updatedMedicalData);
  //present
  useEffect(() => {
    fetchAppointments();
  }, []);
  const fetchAppointments = async () => {
    try {
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
    }
  };

  //present
  const statusMap = {
    X: 'CANCELLED',
    C: 'CONFIRMED',
    B: 'BOOKED',
    P: 'PENDING',
  };
  const handleSavePrescription = async () => {
    if (!selectedAppointment) return;
    function formatAMPM(timeStr) {
      const [hours, minutes, seconds = '00'] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
    const payload = {
      doctorId: selectedAppointment.doctorId,
      regNo: selectedAppointment.patientId,
      patientId: selectedAppointment.patientId,
      date: selectedAppointment.bookingDate,
      time: formatAMPM(selectedAppointment.timeFrom),
      hospitalId: 3,
      status: statusMap[selectedAppointment.bookingStatus] || 'UNKNOWN',
      bookingId: selectedAppointment.appointmentId,
      prescription: prescription,
    };
    try {
      const response = await updatePatientPrescription({
        param: selectedAppointment.appointmentId,
        payload: payload,
      });
      console.log(response);
    } catch (err) {
      console.error(err);
    }

    // Close and reset modal
    setPrescriptionModal(false);
    setConfirmationModal(true);
    setPrescriptionText('');
    setSelectedAppointment(null);
  };

  const formatAppointmentDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      // timeStyle: "short",
    });
  };

  return (
    <>
      {/* Header */}
      <DocHeader />

      <Box
        sx={{
          backgroundColor: '#F9F9F9',
          mb: 6,
        }}
      >
        {/* common change navigate */}
        <Container>
          <Box sx={{ display: 'flex', pt: 6 }}>
            <Button
              onClick={() => {
                navigate('/doctor/dashboard');
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
                    src='https://via.placeholder.com/150'
                    alt='Don Crumb'
                    sx={{ width: 110, height: 110, mx: 'auto', mb: 2 }}
                  />

                  {/* User Details */}
                  <Box sx={{ mt: 2, textAlign: 'left' }}>
                    {userData.map((item, index) => (
                      <Box sx={{ pt: 2 }} key={item.Phone}>
                        <Typography
                          // key={index}//index is causing issues with the key prop of not  being unique
                          variant='body1'
                          sx={{
                            fontSize: 16,
                            fontWeight: 500,
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
                            fontSize: 16,
                            fontWeight: 500,
                            pt: 1,
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  {/* common */}
                  {/* Lab Reports Link */}
                  <Box
                    onClick={() => {
                      navigate(`/doctor/patientProfile/lab/reports/${userId}`);
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

            <Modal open={confirmationModal} onClose={() => setConfirmationModal(false)}>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  minHeight: '40vh',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  borderRadius: 3,
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {/* Success Icon + Message */}
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: '#04BA8E',
                      borderRadius: '50%',
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    <CheckIcon sx={{ color: '#fff', fontSize: 36 }} />
                  </Box>
                  <Typography variant='h6'>Prescription added successfully</Typography>
                </Box>

                {/* Full-width OK Button */}
                <Button
                  variant='contained'
                  sx={{
                    mt: 4,
                    width: '100%',
                    backgroundColor: '#04BA8E',
                    color: '#fff',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#039d78',
                    },
                  }}
                  onClick={() => {
                    setConfirmationModal(false);
                    fetchAppointments();
                  }}
                >
                  Okay
                </Button>
              </Box>
            </Modal>
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
                {/* Common l 394 */}
                {/* Visit Information in Accordion */}
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
                    {appointments.length > 0 ? (
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
                                {formatAppointmentDate(visit.date)}
                              </Grid>
                              <Grid item xs={4}>
                                {visit.reasonForVisit}
                              </Grid>
                              <Grid item xs={4}>
                                {visit.prescription ? (
                                  <Box
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='center'
                                    gap={0.5}
                                  >
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
                                  {!visit.prescription && (
                                    <MenuItem
                                      onClick={() => {
                                        setSelectedAppointment(visit);
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
                                      Add Prescription
                                    </MenuItem>
                                  )}

                                  {visit.prescription && (
                                    <MenuItem
                                      onClick={() => {
                                        setPrescriptionText(visit.prescription);
                                        setSelectedAppointment(visit);
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
                                      Edit Prescription
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
                {updatedMedicalData.map((section, idx) => (
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
                        fontWeight: 'bold',
                        color: '#444444',
                        fontSize: 16,
                      }}
                    >
                      {section.section}
                    </AccordionSummary>

                    <AccordionDetails>
                      {section.records.length > 0 ? (
                        section.records.map((record, i) => (
                          <Grid container spacing={1} sx={{ mb: 1, pl: 2 }} key={i}>
                            <Grid item xs={4}>
                              <Typography variant='body2'>{record}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant='body2'>{record.diagnosticDate}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant='body2'>{record.treatment}</Typography>
                            </Grid>
                          </Grid>
                        ))
                      ) : (
                        <Typography variant='body2' color='textSecondary' sx={{ pl: 2 }}>
                          No records available.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

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
              Add Prescription
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
              onChange={(e) => setPrescriptionText(e.target.value)}
              inputProps={{ maxLength: 240 }}
            />
            <Box textAlign='right' mt={0.5}>
              <Typography variant='caption' color='textSecondary'>
                {prescription.length}/240
              </Typography>
            </Box>
          </Box>

          {/* Save Button */}
          <Button
            fullWidth
            variant='contained'
            sx={{
              backgroundColor: '#04BA8E',
              color: '#fff',
              display: { xs: 'none', md: 'block' },

              padding: '10px 56px',
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '18px',
              textTransform: 'capitalize',
              '&:hover': {
                // Keep the background color the same on hover
                backgroundColor: '#04BA8E', // Same as default
              },
            }}
            onClick={handleSavePrescription}
            disabled={!prescription.trim()}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ViewPatientProfile;
