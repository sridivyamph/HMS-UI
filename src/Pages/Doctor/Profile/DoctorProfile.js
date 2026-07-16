import React, { useEffect, useState } from 'react';
import {
  Box, Container, Grid, Typography, Card, CardContent, Avatar, Button, Divider, Chip
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DocHeader from '../../../Components/Header/DocHeader';
import Footer from '../../../Components/Footer/footer';
import { useNavigate } from 'react-router-dom';
import { getAppUserId, getUserData } from '../../../Services/DoctorServices';
import { useDispatch, useSelector } from 'react-redux';
import { updateDoctorOriginalId } from '../../../Redux/Modules/Doctor/DoctorSlice';

const Section = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant='subtitle2' color='#04BA8E' fontWeight={700} sx={{ mb: 1.5, letterSpacing: 0.5 }}>
      {title}
    </Typography>
    <Box sx={{ pl: 0.5 }}>{children}</Box>
  </Box>
);

const Field = ({ label, value }) => (
  <Box sx={{ display: 'flex', mb: 1 }}>
    <Typography variant='body2' color='#6E6E6E' sx={{ minWidth: 140, flexShrink: 0 }}>
      {label}
    </Typography>
    <Typography variant='body2' color='#2B2A29' fontWeight={500}>
      {value || 'N/A'}
    </Typography>
  </Box>
);

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
                    <Typography variant='body2' color='textSecondary' sx={{ mb: 1 }}>{profile.departmentName}</Typography>
                    <Chip
                      label={profile.status === 'A' ? 'Active' : 'Inactive'}
                      size='small'
                      color={profile.status === 'A' ? 'success' : 'default'}
                      variant='outlined'
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={9}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Section title='CONTACT'>
                      <Field label='Email' value={profile.emailId} />
                      <Field label='Secondary Email' value={profile.secondaryEmail} />
                      <Field label='Mobile' value={profile.mobileNo} />
                      <Field label='Address' value={profile.address} />
                      <Field label='City' value={profile.cityName} />
                      <Field label='State' value={profile.stateName} />
                      <Field label='Country' value={profile.countryName} />
                    </Section>
                    <Divider sx={{ my: 2 }} />
                    <Section title='PROFESSIONAL'>
                      <Field label='Department' value={profile.departmentName} />
                      <Field label='Specialization' value={profile.specialization} />
                      <Field label='Designation' value={profile.designationName} />
                      <Field label='Qualification' value={profile.qualification} />
                      <Field label='Degree' value={profile.degree} />
                      <Field label='Doctor Type' value={profile.doctorTypeName} />
                      <Field label='Registration No' value={profile.doctorRegNo} />
                      <Field label='Gender' value={profile.gender === 'F' ? 'Female' : profile.gender === 'M' ? 'Male' : profile.gender} />
                    </Section>
                    <Divider sx={{ my: 2 }} />
                    <Section title='HOSPITAL'>
                      <Field label='Hospital' value={profile.hospitalName} />
                      <Field label='Hospital ID' value={profile.hospId} />
                    </Section>
                  </CardContent>
                </Card>
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
