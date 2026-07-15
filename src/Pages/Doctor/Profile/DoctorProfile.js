import React, { useEffect, useState } from 'react';
import {
  Box, Container, Grid, Typography, Accordion, AccordionSummary,
  AccordionDetails, Card, CardContent, Avatar, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DocHeader from '../../../Components/Header/DocHeader';
import Footer from '../../../Components/Footer/footer';
import { useNavigate } from 'react-router-dom';
import { getAppUserId, getUserData } from '../../../Services/DoctorServices';
import { useDispatch, useSelector } from 'react-redux';
import { updateDoctorOriginalId } from '../../../Redux/Modules/Doctor/DoctorSlice';

const DoctorProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appConfig, isConfigLoaded } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigLoaded) return;
    getAppUserId().then((res) => {
      const cloakId = res?.userId;
      if (!cloakId) return;
      const hosId = appConfig?.hospitalId;
      getUserData({ cloakId, hosId }).then((data) => {
        setProfile(data);
        dispatch(updateDoctorOriginalId(data?.doctorId));
      }).catch(() => {})
        .finally(() => setLoading(false));
    });
  }, [isConfigLoaded]);

  const rows = profile ? [
    { label: 'Name', value: profile.doctorName },
    { label: 'Email', value: profile.emailId },
    { label: 'Secondary Email', value: profile.secondaryEmail },
    { label: 'Mobile', value: profile.mobileNo },
    { label: 'Gender', value: profile.gender === 'F' ? 'Female' : profile.gender === 'M' ? 'Male' : profile.gender },
    { label: 'Department', value: profile.departmentName },
    { label: 'Specialization', value: profile.specialization },
    { label: 'Designation', value: profile.designationName },
    { label: 'Qualification', value: profile.qualification },
    { label: 'Degree', value: profile.degree },
    { label: 'Doctor Type', value: profile.doctorTypeName },
    { label: 'Registration No', value: profile.doctorRegNo },
    { label: 'Hospital', value: profile.hospitalName },
    { label: 'Address', value: profile.address },
    { label: 'City', value: profile.cityName },
    { label: 'State', value: profile.stateName },
    { label: 'Country', value: profile.countryName },
    { label: 'Status', value: profile.status === 'A' ? 'Active' : 'Inactive' },
  ] : [];

  return (
    <>
      <DocHeader />
      <Box sx={{ backgroundColor: '#F9F9F9', minHeight: '100vh' }}>
        <Container>
          <Box sx={{ display: 'flex', pt: 6 }}>
            <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIosIcon />}>
              <Typography sx={{ fontWeight: 600, fontSize: 24 }}>Profile</Typography>
            </Button>
          </Box>

          {loading ? (
            <Typography sx={{ mt: 4, textAlign: 'center' }} color='textSecondary'>Loading...</Typography>
          ) : !profile ? (
            <Typography sx={{ mt: 4, textAlign: 'center' }} color='textSecondary'>Unable to load profile.</Typography>
          ) : (
            <Grid container spacing={3} sx={{ mt: 3, pb: 6 }}>
              <Grid item xs={12} md={3}>
                <Card sx={{ borderRadius: 2, backgroundColor: '#04BA8E05' }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar
                      sx={{ width: 110, height: 110, mx: 'auto', mb: 2, bgcolor: '#04BA8E', fontSize: 40 }}
                    >
                      {profile.doctorName?.charAt(0) || 'D'}
                    </Avatar>
                    <Typography variant='h6' fontWeight={600}>{profile.doctorName}</Typography>
                    <Typography variant='body2' color='textSecondary'>{profile.specialization}</Typography>
                    <Typography variant='body2' color='textSecondary'>{profile.departmentName}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={9}>
                <Box sx={{ backgroundColor: '#fff', borderRadius: 2, py: 3, px: 3 }}>
                  <Accordion defaultExpanded sx={{ mb: 2, backgroundColor: '#04BA8E0A', borderRadius: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#04BA8E' }} />}>
                      <Typography fontWeight='bold' fontSize={16}>Personal Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={4}><Typography variant='subtitle2' fontWeight={600}>Field</Typography></Grid>
                        <Grid item xs={8}><Typography variant='subtitle2' fontWeight={600}>Detail</Typography></Grid>
                        {rows.map((r, i) => (
                          <React.Fragment key={i}>
                            <Grid item xs={4}>
                              <Typography variant='body2' color='#6E6E6E'>{r.label}</Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant='body2' color='#2B2A29'>{r.value || 'N/A'}</Typography>
                            </Grid>
                          </React.Fragment>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default DoctorProfile;
