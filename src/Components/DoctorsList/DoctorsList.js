import React, { useEffect, useState } from 'react';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import {
  Grid,
  Box,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
  IconButton,
  Link,
  TablePagination,
  Container,
  Skeleton,
} from '@mui/material';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorAvailableDatesThunk } from '../../Redux/Modules/Patient/HomeThunk';
import { updateSelectedDoctor, updateAppointment } from '../../Redux/Modules/Patient/HomeSlice';
import AppoinmentDialog from '../Dialogs/AppoinmentDialog/appoinmentDialog';
import AppointmentSuccessDialog from '../Dialogs/AppoinmentSuccessDialog/appointmentSuccess';
import { updateloginSignupAction } from '../../Redux/Modules/Patient/HomeSlice';
import { useNavigate } from 'react-router-dom';

const DoctorsList = ({
  setLoginSignupDialogOpen,
  handlePageChange,
  handleSizeChange,
  pagination,
}) => {
  const dispatch = useDispatch();
  const { doctorListError, isUserLoggedIn, doctorList, doctorListLoading } = useSelector(
    (state) => state.home
  );

  const [isBookNowDialogOpen, setBookNowDialogOpen] = useState(false);
  const [isBookingSuccesOpen, setBookingSuccessOpen] = useState(false);

  const navigate = useNavigate();
  const handleBookNow = (doctor) => {
    const { doctorId } = doctor;
    let payload = {
      doctorId,
    };
    dispatch(updateSelectedDoctor(doctor));
    dispatch(getDoctorAvailableDatesThunk(payload));
    setBookNowDialogOpen(true);
  };

  const handleBookappoinmnet = (doctor) => {
    if (!isUserLoggedIn) {
      dispatch(updateloginSignupAction('book'));
      setLoginSignupDialogOpen(true);
    } else {
      handleBookNow(doctor);
    }
  };

  return (
    <>
      <Box sx={{ backgroundColor: '#FBFBFB', padding: '24px 0' }}>
        <Container>
          <Box sx={{ padding: { xs: '16px', sm: '24px' } }}>
            <Grid container spacing={3}>
              {doctorListLoading
                ? [...Array(6)].map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          borderRadius: '8px',
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Skeleton variant='circular' width={100} height={100} sx={{ mr: 2 }} />
                            <Box sx={{ flex: 1 }}>
                              <Skeleton variant='text' width='80%' height={24} />
                              <Skeleton variant='text' width='60%' height={20} />
                              <Skeleton variant='text' width='50%' height={20} sx={{ mt: 1 }} />
                            </Box>
                          </Box>
                        </CardContent>
                        <CardActions
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '16px',
                            flexDirection: {
                              sm: 'column',
                              md: 'row',
                            },
                          }}
                        >
                          <Skeleton variant='rectangular' height={40} width='48%' />
                          <Skeleton variant='rectangular' height={40} width='48%' />
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                : doctorList?.content?.map((doctor, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          borderRadius: '8px',
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                              src={doctor.image}
                              alt={doctor.name}
                              sx={{ width: 100, height: 100, mr: 2, borderRadius: '50%' }}
                            />
                            <Box>
                              <Typography variant='h6' sx={{ fontSize: 18, lineHeight: '28px' }}>
                                {doctor.doctorName}
                              </Typography>
                              <Typography
                                variant='body2'
                                color='textSecondary'
                                sx={{ color: '#333333', fontSize: 14 }}
                              >
                                {doctor.specialization}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <SchoolOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
                                <Typography
                                  variant='body2'
                                  color='textSecondary'
                                  sx={{ fontSize: 12 }}
                                >
                                  {doctor.qualification}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                        <CardActions
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '16px',
                            flexDirection: {
                              sm: 'column',
                              md: 'row',
                            },
                          }}
                        >
                          <Button
                            variant='contained'
                            color='primary'
                            onClick={() => {
                              handleBookappoinmnet(doctor);
                            }}
                            sx={{
                              backgroundColor: '#04BA8E',
                              color: '#fff',
                              textTransform: 'none',
                              borderRadius: '8px',
                              padding: '10px 56px',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#04BA8E',
                              },
                            }}
                          >
                            Book now
                          </Button>
                          <Button
                            variant='outlined'
                            endIcon={<VideoCameraFrontIcon />}
                            disabled={true}
                            sx={{
                              textTransform: 'none',
                              borderColor: '#00ba88',
                              color: '#00ba88',
                              borderRadius: '8px',
                              padding: '10px 18px',
                            }}
                          >
                            Digital Consult
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      <AppoinmentDialog
        open={isBookNowDialogOpen}
        onClose={() => {
          setBookNowDialogOpen(false);
        }}
        paymentSuccess={() => {
          setBookNowDialogOpen(false);
          setBookingSuccessOpen(true);
        }}
      />

      <AppointmentSuccessDialog
        open={isBookingSuccesOpen}
        onClose={() => {
          setBookingSuccessOpen(false);
          dispatch(updateAppointment(true));
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <TablePagination
          rowsPerPageOptions={[6, 12, 18]}
          component='div'
          count={doctorList?.page?.totalElements || 0}
          rowsPerPage={pagination.size}
          page={pagination.page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleSizeChange}
        />
      </div>
    </>
  );
};

export default DoctorsList;
