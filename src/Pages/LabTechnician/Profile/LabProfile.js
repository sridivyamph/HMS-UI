import React, { useEffect, useState } from 'react';
import {
  Box, Container, Grid, Typography, Card, CardContent, Avatar, Button
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LabHeader from '../../../Components/Header/LabHeader';
import Footer from '../../../Components/Footer/footer';
import { useNavigate } from 'react-router-dom';
import { getAppUserId, getUserData } from '../../../Services/LabServices';
import { useDispatch, useSelector } from 'react-redux';
import { appUserDataCall, appUserIdCall } from '../../../Redux/Modules/LabTechnician/LabThunk';

const LabProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appConfig, isConfigLoaded } = useSelector((state) => state.auth);
  const { userId, technicianData } = useSelector((state) => state.LabTechnician);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigLoaded) return;
    dispatch(appUserIdCall());
  }, [isConfigLoaded]);

  useEffect(() => {
    if (!userId || !appConfig?.hospitalId) return;
    const payload = { cloakId: userId, hosId: appConfig.hospitalId };
    dispatch(appUserDataCall(payload)).then((res) => {
      if (res.payload) setProfile(res.payload);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (technicianData) setProfile(technicianData);
  }, [technicianData]);

  const initials = profile?.username?.charAt(0).toUpperCase() || 'L';

  return (
    <>
      <LabHeader />
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
                    <Avatar sx={{ width: 110, height: 110, mx: 'auto', mb: 2, bgcolor: '#04BA8E', fontSize: 40 }}>
                      {initials}
                    </Avatar>
                    <Typography variant='h6' fontWeight={600}>{profile.username}</Typography>
                    <Typography variant='body2' color='textSecondary'>{profile.referenceType}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={9}>
                <Box sx={{ backgroundColor: '#fff', borderRadius: 2, py: 3, px: 3 }}>
                  <Typography variant='h6' fontWeight={600} mb={3}>Account Information</Typography>
                  <Grid container spacing={2}>
                    {[
                      { label: 'Username', value: profile.username },
                      { label: 'Role', value: profile.referenceType },
                      { label: 'Hospital ID', value: profile.hospId },
                      { label: 'Status', value: profile.isActive ? 'Active' : 'Inactive' },
                      { label: 'Created', value: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A' },
                      { label: 'Updated', value: profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A' },
                    ].map((r, i) => (
                      <React.Fragment key={i}>
                        <Grid item xs={4}><Typography variant='body2' color='#6E6E6E'>{r.label}</Typography></Grid>
                        <Grid item xs={8}><Typography variant='body2' color='#2B2A29'>{r.value || 'N/A'}</Typography></Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
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

export default LabProfile;
