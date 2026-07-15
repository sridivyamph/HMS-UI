import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import RegsiterBackground from '../../../assets/Guest flow 2/image.png';
import Logo from '../../../assets/RegisterLogo.svg';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { savePatientDetailsThunk } from '../../../Redux/Modules/Patient/HomeThunk';
import { useNavigate } from 'react-router-dom';
import { getAllLocations } from '../../../Services/adminService';

const RegistrationForm = ({ onClose, phoneNumber }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);
  const { registrationNumber } = useSelector((state) => state.home);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: phoneNumber || '',
    secondaryMobile: '',
    secondaryEmail: '',
    gender: '',
    dob: '',
    pincode: '',
    address: '',
    city: '',
    country: '',
    nationality: '',
    stateId: '',
  });

  const [errors, setErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    getAllLocations().then((data) => {
      setCountryList(data || []);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'country') {
      const selectedCountry = countryList.find((c) => c.countryId === value);
      setStateList(selectedCountry?.states || []);
      setCityList([]);
      setFormData((prev) => ({ ...prev, stateId: '', city: '' }));
    }

    if (name === 'stateId') {
      const selectedState = stateList.find((s) => s.stateId === value);
      setCityList(selectedState?.cities || []);
      setFormData((prev) => ({ ...prev, city: '' }));
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Required Field Validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.secondaryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.secondaryEmail)) {
      newErrors.secondaryEmail = 'Enter a valid secondary email address';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    } else {
      const selectedDate = new Date(formData.dob);
      const today = new Date();
      if (selectedDate >= today) {
        newErrors.dob = 'Date of Birth must be in the past';
      }
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit data
    const patientData = {
      patientId: registrationNumber,
      name: `${formData.firstName} ${formData.lastName}`,
      dateOfBirth: formData.dob,
      gender: formData.gender,
      mobileNo: formData.mobileNumber,
      secMobileNumber: formData.secondaryMobile,
      address: formData.address,
      secondaryEmail: formData.secondaryEmail,
      pin: formData.pincode,
      city: formData.city,
      country: formData.country,
    };

    dispatch(
      savePatientDetailsThunk({
        param: registrationNumber,
        payload: patientData,
      })
    );

    onClose();
  };

  const handleWithoutSaving = () => {
    setCancelDialogOpen(false);
    onClose();
    navigate('/patient/dashboard');
    window.location.reload();
  };

  return (
    <Grid container>
      {/* Left Image Section */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '40px',
            backgroundImage: `linear-gradient(180deg, rgba(0, 40, 30, 0.7) 0%, rgba(31, 65, 57, 0.56) 48.43%, rgba(217, 217, 217, 0.7) 100%), url(${RegsiterBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            color: 'white',
          }}
        >
          <Box component={'img'} src={Logo} sx={{ width: '200px', height: '74px' }} />
          <Typography
            variant='h6'
            fontWeight='bold'
            sx={{ fontSize: 48, color: 'rgba(29, 248, 195, 1)' }}
          >
            Find and Book Appointments with Trusted Doctors
          </Typography>
          <Typography variant='body2' sx={{ fontSize: 28, color: '#fff' }}>
            Quickly browse verified doctors, read reviews, and schedule your in-person or virtual
            consultation with ease.
          </Typography>
        </Box>
      </Grid>

      {/* Right Form Section */}
      <Grid item xs={12} md={6}>
        <Box sx={{ padding: '16px 32px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h6'>Setup your account</Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => setCancelDialogOpen(true)} />
          </Box>
          <Typography variant='subtitle2' sx={{ color: '#868686' }}>
            STEP 3 OF 3
          </Typography>

          {/* Registration Info */}
          <Box
            sx={{
              background: 'linear-gradient(43deg, rgba(190, 243, 221, 0.26) 1.63%, #ECFBFA 81.43%)',
              padding: '8px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 2,
            }}
          >
            <CheckCircleOutlineOutlinedIcon sx={{ color: '#66B96A', mr: 0.5 }} />
            <Box sx={{ color: '#444444' }}>Registration ID Created:</Box>
          </Box>
          <Box
            sx={{
              padding: '12px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ color: '#444444' }}>
              Your registration number is <strong>{registrationNumber}</strong>
            </Box>
            <ContentCopyOutlinedIcon sx={{ color: '#2B2A29', ml: 0.5, cursor: 'pointer' }} />
          </Box>

          {/* Form */}
          <Box component={'form'} onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name='firstName'
                  label='First Name*'
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name='lastName'
                  label='Last Name*'
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name='mobileNumber'
                  label='Mobile Number*'
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber}
                  disabled={!!formData.mobileNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name='secondaryMobile'
                  label='Secondary Mobile'
                  value={formData.secondaryMobile}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name='secondaryEmail'
                  label='Secondary Email'
                  value={formData.secondaryEmail}
                  onChange={handleChange}
                  error={!!errors.secondaryEmail}
                  helperText={errors.secondaryEmail}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name='gender'
                  label='Gender*'
                  select
                  value={formData.gender}
                  onChange={handleChange}
                  error={!!errors.gender}
                  helperText={errors.gender}
                >
                  <MenuItem value='Male'>Male</MenuItem>
                  <MenuItem value='Female'>Female</MenuItem>
                  <MenuItem value='Other'>Other</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name='dob'
                  label='Date of Birth*'
                  type='date'
                  value={formData.dob}
                  onChange={handleChange}
                  error={!!errors.dob}
                  helperText={errors.dob}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Country */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label='Country'
                  name='country'
                  value={formData.country}
                  onChange={handleChange}
                  error={Boolean(errors.country)}
                  helperText={errors.country}
                >
                  {countryList.map((country) => (
                    <MenuItem key={country.countryId} value={country.countryId}>
                      {country.countryName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* State */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label='State'
                  name='stateId'
                  value={formData.stateId}
                  onChange={handleChange}
                  disabled={!formData.country}
                  error={Boolean(errors.stateId)}
                  helperText={errors.stateId}
                >
                  {stateList.map((state) => (
                    <MenuItem key={state.stateId} value={state.stateId}>
                      {state.stateName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* City */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label='City'
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!formData.stateId}
                  error={Boolean(errors.city)}
                  helperText={errors.city}
                >
                  {cityList.map((city) => (
                    <MenuItem key={city.cityId} value={city.cityId}>
                      {city.cityName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name='address'
                  label='Address'
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Button
              fullWidth
              type='submit'
              variant='contained'
              sx={{
                mt: 3,
                borderRadius: '8px',
                py: '10px',
                backgroundColor: '#04BA8E',
                color: '#fff',
                ':hover': { backgroundColor: '#04BA8E' },
              }}
            >
              Continue
            </Button>

            <Box sx={{ display: 'flex', my: 2, fontSize: 14, justifyContent: 'center' }}>
              By clicking Continue, you agree to Doccure’s
              <Box sx={{ color: '#04BA8E', ml: 0.5 }}>Privacy Policy, Terms and Conditions</Box>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Cancel Dialog */}
      <Dialog
        maxWidth='xs'
        open={isCancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        sx={{
          '& .MuiPaper-root': { zIndex: 1400 },
          '.MuiDialog-paper': {
            padding: '24px',
            borderRadius: '32px',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h6'>Are you sure want to cancel</Typography>
            <CloseIcon onClick={() => setCancelDialogOpen(false)} sx={{ cursor: 'pointer' }} />
          </Box>
        </DialogTitle>
        <DialogContent>
          Any information you’ve entered so far will not be saved, but your registration ID has
          already been created. You can return later to complete the setup.
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button
            onClick={handleWithoutSaving}
            sx={{
              backgroundColor: '#fff',
              color: '#04BA8E',
              borderRadius: '8px',
              border: '1px solid #04BA8E',
              padding: '10px 20px',
              '&:hover': {
                backgroundColor: '#fff',
              },
            }}
          >
            Exit Without Saving
          </Button>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            sx={{
              backgroundColor: '#04BA8E',
              color: '#fff',
              borderRadius: '8px',
              padding: '10px 20px',
              '&:hover': {
                backgroundColor: '#04BA8E',
              },
            }}
          >
            Continue Setup
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default RegistrationForm;
