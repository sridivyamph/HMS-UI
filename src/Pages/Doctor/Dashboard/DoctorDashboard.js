import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Menu,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Container,
  TablePagination,
  Skeleton,
} from '@mui/material';
import { useEffect, useRef } from 'react';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DocHeader from '../../../Components/Header/DocHeader';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDoctorUpcomingAppointmentsList,
  fetchDoctorPreviousAppointmentsList,
} from '../../../Redux/Modules/Doctor/DoctorThunk';
import { getDoctorVisitsAndConsults } from '../../../Services/DoctorServices';
const DocDashboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [visitorsCount, setvisitorsCount] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorElOverview, setAnchorElOverview] = useState(null);
  const [anchorElVisitors, setAnchorElVisitors] = useState(null);
  const doctorResponse = useSelector((state) => state.doctor);

  const upcomingAppointment = useSelector((state) => state.doctor?.upcomingAppointmentList);

  const previousAppointment = useSelector((state) => state.doctor?.previousAppointmentList);
  const isLoading = useSelector((state) => state.doctor?.isLoading);
  const [appointmentList, setAppointmentList] = useState([]);
  const [appointmentListCache, setAppointmentListCache] = useState([]);
  const [timeRange, setTimeRange] = useState(null); // default

  const dispatch = useDispatch();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOverviewClick = (event) => {
    setAnchorElOverview(event.currentTarget);
  };
  const handleOverviewClose = () => {
    setAnchorElOverview(null);
  };
  const handleVisitorsClick = (event) => {
    setAnchorElVisitors(event.currentTarget);
  };
  const handleVisitorsClose = () => {
    setAnchorElVisitors(null);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (tabValue === 0) {
      setAppointmentList(upcomingAppointment || []);
      setAppointmentListCache(upcomingAppointment || []);
    } else if (tabValue === 1) {
      setAppointmentList(previousAppointment || []);
      setAppointmentListCache(previousAppointment || []);
    }
  }, [tabValue, upcomingAppointment, previousAppointment]);

  useEffect(() => {
    if (!doctorResponse?.originalId) return;
    if (tabValue === 0) {
      dispatch(
        fetchDoctorUpcomingAppointmentsList({
          param: doctorResponse.originalId,
          filter: 'upcoming',
          page: page,
          size: rowsPerPage,
        })
      );
    } else if (tabValue === 1) {
      dispatch(
        fetchDoctorPreviousAppointmentsList({
          param: doctorResponse.originalId,
          filter: 'previous',
          page: page,
          size: rowsPerPage,
        })
      );
    }
  }, [doctorResponse?.originalId, tabValue, page, rowsPerPage, dispatch]);

  useEffect(() => {
    if (!doctorResponse?.originalId) return;

    let param = `doctorId=${doctorResponse.originalId}`;

    if (timeRange) {
      param += `&timeRange=${timeRange}`;
    }

    getDoctorVisitsAndConsults(param)
      .then((res) => {
        setvisitorsCount(res);
      })
      .catch((err) => {
        console.log(err, 'Error');
      });
  }, [doctorResponse?.originalId, timeRange]); // 👈 added timeRange here

  return (
    <>
      <DocHeader />
      <Box sx={{ backgroundColor: '#F9F9F9' }}>
        <Container sx={{ pt: 8 }}>
          <Grid container spacing={2} alignItems='stretch'>
            {/* Overview Section */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                  <Typography variant='h6' sx={{ color: '#2B2A29', fontSize: 16 }}>
                    Overview
                  </Typography>
                  <IconButton onClick={handleOverviewClick} sx={{ color: '#2B2A29', fontSize: 16 }}>
                    All Time <KeyboardArrowDownIcon sx={{ color: '#2B2A29', fontSize: 16 }} />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElOverview}
                    open={Boolean(anchorElOverview)}
                    onClose={handleOverviewClose}
                  >
                    <MenuItem
                      onClick={() => {
                        setTimeRange('today');
                        handleOverviewClose();
                      }}
                    >
                      Today
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setTimeRange('yesterday');
                        handleOverviewClose();
                      }}
                    >
                      Yesterday
                    </MenuItem>
                  </Menu>
                </Box>

                <Grid container spacing={2} mt={3}>
                  <Grid item xs={6}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        backgroundColor: '#fff',
                      }}
                    >
                      <CorporateFareIcon
                        sx={{
                          backgroundColor: '#04BA8E0A',
                          color: '#04BA8E',
                          height: '64px',
                          width: '64px',
                        }}
                      />
                      <Box>
                        <Typography sx={{ fontSize: 16, color: '#6E6E6E' }} variant='body2'>
                          Hospital Visit
                        </Typography>
                        <Typography sx={{ fontSize: 24, color: '#2B2A29' }} variant='h5'>
                          {visitorsCount?.hospitalVisits || 0}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        backgroundColor: '#fff',
                      }}
                    >
                      <VideoCallIcon
                        sx={{
                          backgroundColor: '#04BA8E0A',
                          color: '#04BA8E',
                          height: '64px',
                          width: '64px',
                        }}
                      />
                      <Box>
                        <Typography sx={{ fontSize: 16, color: '#6E6E6E' }} variant='body2'>
                          Digital Consult
                        </Typography>
                        <Typography sx={{ fontSize: 24, color: '#2B2A29' }} variant='h5'>
                          {visitorsCount?.digitalConsults || 0}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Total Visitors Section */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                  <Typography variant='h6'>Total Visitors</Typography>
                  <IconButton onClick={handleVisitorsClick}>
                    This Month <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElVisitors}
                    open={Boolean(anchorElVisitors)}
                    onClose={handleVisitorsClose}
                  >
                    <MenuItem onClick={handleVisitorsClose}>Last Week</MenuItem>
                    <MenuItem onClick={handleVisitorsClose}>Last Month</MenuItem>
                    <MenuItem onClick={handleVisitorsClose}>Last Year</MenuItem>
                  </Menu>
                </Box>
                <Box mt={2} sx={{ textAlign: 'center' }}>
                  <Typography variant='h4' color='primary'>
                    0
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Visitors this month
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            sx={{ mt: 6, backgroundColor: '#fff', borderRadius: '32px', py: 1 }}
          >
            {/* Tabs & Sorting Dropdown */}
            <Grid item xs={12}>
              <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  textColor='primary'
                  indicatorColor='primary'
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      gap: 2, // Space between tabs
                    },
                    '& .MuiTab-root': {
                      borderRadius: '56px', // Rounded border
                      padding: '16px 32px', // Padding
                      textTransform: 'none', // Keep text normal case
                      fontWeight: 500,
                      fontSize: 18,
                      transition: 'all 0.3s ease',
                    },
                    '& .Mui-selected': {
                      background:
                        'linear-gradient(43deg, rgba(190, 243, 221, 0.104) 1.63%, rgba(236, 251, 250, 0.4) 81.43%)',

                      color: '#04BA8E', // Active tab text color
                      border: '1px solid #04BA8EB2',
                    },
                    '& .MuiTab-root:not(.Mui-selected)': {
                      backgroundColor: '#FFFFFF', // Inactive tab transparent
                      color: '#444444', // Normal text color
                      border: '1px solid #6E6E6E3D',
                    },
                    '& .MuiTab-root:hover': {
                      backgroundColor: '#E0F2F1', // Light hover effect
                    },
                    '& .MuiTabs-indicator': {
                      height: 0,
                      backdropClasses: 'none',
                    },
                  }}
                >
                  <Tab label='Upcoming Appointments' />
                  <Tab label='Previous Appointments' />
                </Tabs>

                <IconButton
                  onClick={handleOverviewClick}
                  sx={{
                    color: '#2B2A29',
                    fontSize: 16,
                    mx: 3,
                    '&:hover': {
                      backgroundColor: 'transparent', // Disables hover background effect
                      color: 'inherit', // Keeps the text color unchanged
                    },
                    '&:active': {
                      backgroundColor: 'transparent', // Disables active background effect
                    },
                    '&:focus': {
                      outline: 'none', // Removes focus outline
                      backgroundColor: 'transparent', // Ensures no focus background
                    },
                  }}
                >
                  Sort By
                  <KeyboardArrowDownIcon
                    sx={{
                      color: '#2B2A29',
                      fontSize: 22,
                      mx: 1,
                    }}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorElOverview}
                  open={Boolean(anchorElOverview)}
                  onClose={handleOverviewClose}
                >
                  <MenuItem onClick={handleOverviewClose}>Last Week</MenuItem>
                  <MenuItem onClick={handleOverviewClose}>Last Month</MenuItem>
                  <MenuItem onClick={handleOverviewClose}>Last Year</MenuItem>
                </Menu>
              </Box>
            </Grid>

            {/* Appointments Table */}
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#04BA8E0A' }}>
                    <TableRow>
                      <TableCell>Patient Name</TableCell>
                      {/* <TableCell>Age</TableCell> */}
                      {/* <TableCell>Date Of Birth</TableCell> */}
                      <TableCell>Gender</TableCell>
                      {/* <TableCell>Type</TableCell> */}
                      {/* <TableCell>Phone no.</TableCell> */}
                      {/* <TableCell>Reason for Visit</TableCell> */}
                      {/* <TableCell>Date</TableCell> */}
                      <TableCell>Appointment Time</TableCell>
                      <TableCell>Visit Type</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      Array.from(new Array(rowsPerPage)).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Skeleton variant='text' />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant='text' />
                          </TableCell>
                          {/* <TableCell>
                            <Skeleton variant='text' />
                          </TableCell> */}
                          <TableCell>
                            <Skeleton variant='text' />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant='text' />
                          </TableCell>
                          <TableCell>
                            <Skeleton
                              variant='rectangular'
                              animation='wave'
                              width={100}
                              height={32}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <>
                        {appointmentList?.content?.length > 0 &&
                          appointmentList?.content
                            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((appointment, index) => (
                              <TableRow
                                sx={{
                                  backgroundColor: '#fff',

                                  borderRadius: 2, // Rounded corners
                                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Light shadow for separation
                                  my: 2, // Space between rows (marginY)
                                }}
                                key={index}
                              >
                                <TableCell>{appointment.patientName}</TableCell>
                                {/* <TableCell>{appointment.age}</TableCell> */}
                                {/* <TableCell>{appointment.patientDob}</TableCell> */}
                                <TableCell>{appointment.patientGender}</TableCell>
                                {/* <TableCell>{appointment.type}</TableCell> */}
                                {/* <TableCell>{appointment.phoneNo}</TableCell> */}
                                {/* <TableCell>{appointment.reasonForVisit}</TableCell> */}
                                {/* <TableCell>{appointment.date}</TableCell> */}
                                <TableCell>{appointment.appointmentTime}</TableCell>
                                <TableCell>{appointment.visitType}</TableCell>
                                <TableCell>
                                  <Button
                                    onClick={() =>
                                      navigate(`/doctor/patientProfile/${appointment.patientId}`)
                                    }
                                    sx={{
                                      color: '#04BA8E',
                                      textDecoration: 'underline',
                                      fontSize: 14,
                                      fontWeight: 500,
                                    }}
                                    size='small'
                                  >
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                      </>
                    )}
                  </TableBody>

                  {/* <TableBody sx={{ backgroundColor: 'red' }}>
                  
                  </TableBody> */}
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component='div'
                count={appointmentList?.page?.totalElements || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default DocDashboard;
