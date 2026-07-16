import React, { useEffect, useState } from 'react';
import {
  Box, Container, Grid, Typography, Card, CardContent, Avatar, Button, Chip
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ReceptionHeader from '../../../Components/Header/ReceptionHeader';
import Footer from '../../../Components/Footer/footer';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { appUserDataCall, appUserIdCall } from '../../../Redux/Modules/Reception/ReceptionThunk';

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

const ReceptionProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appConfig, isConfigLoaded } = useSelector((state) => state.auth);
  const { userId, receptionData } = useSelector((state) => state.reception);
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
    if (receptionData) setProfile(receptionData);
  }, [receptionData]);

  const initials = profile?.username?.charAt(0).toUpperCase() || 'R';

  return (
    <>
      <ReceptionHeader />
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
                    <Typography variant='body2' color='textSecondary' sx={{ mb: 1 }}>{profile.referenceType}</Typography>
                    <Chip
                      label={profile.isActive ? 'Active' : 'Inactive'}
                      size='small'
                      color={profile.isActive ? 'success' : 'default'}
                      variant='outlined'
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={9}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant='subtitle2' color='#04BA8E' fontWeight={700} sx={{ mb: 2, letterSpacing: 0.5 }}>
                      ACCOUNT INFORMATION
                    </Typography>
                    <Field label='Username' value={profile.username} />
                    <Field label='Role' value={profile.referenceType} />
                    <Field label='Hospital ID' value={profile.hospId} />
                    <Field label='Created' value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'} />
                    <Field label='Updated' value={profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'} />
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

export default ReceptionProfile;
