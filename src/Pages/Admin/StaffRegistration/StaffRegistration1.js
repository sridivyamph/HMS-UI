import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import {
  adminStaffRegsitration,
  adminLoadDefaultfields,
  getAllLocations,
} from '../../../Services/adminService';
import AdminUserSuccessDialog from '../../../Components/Dialogs/AdminUserSuccessDialog/AdminUserSuccessDialog';
import { updateBackdrop } from '../../../Redux/Modules/Patient/HomeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const StaffRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appConfig } = useSelector((state) => state.auth);
  const hospitalId = appConfig?.hospitalId;
  const [formData, setFormData] = useState({
    staffName: '',
    gender: '',
    mobileNo: '',
    secondaryMob: '',
    designation: '',
    degree: '',
    secondaryEmail: '',
    address: '',
    cityId: '',
    pinCode: '',
    stateId: '',
    countryId: '',
    username: '',
    emailId: '',
    referenceType: '',
    status: '',
    hospId: hospitalId,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [desgList, setDesgList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [isSuccessDialogOpen, setSuccessDialog] = useState(false);
  const [referenceTypeList, setreferenceTypeList] = useState([
    { categoryId: 'RECEPTIONIST', categoryDetailName: 'RECEPTIONIST' },
    { categoryId: 'LAB-TECHNICIAN', categoryDetailName: 'LAB-TECHNICIAN' },
  ]);
  const [statusOptions] = useState([
    { categoryId: 'A', categoryDetailName: 'Active' },
    { categoryId: 'I', categoryDetailName: 'Inactive' },
  ]);
  const [apiResponse, setApiResponse] = useState('');
  const FIELD_LABELS = {
    staffName: 'Staff Name',
    gender: 'Gender',
    mobileNo: 'Mobile Number',
    secondaryMob: 'Secondary Mobile',
    designation: 'Designation',
    degree: 'Degree',
    secondaryEmail: 'Secondary Email',
    // qualification: 'Qualification',
    address: 'Address',
    cityId: 'City',
    pinCode: 'Pin Code',
    stateId: 'State',
    countryId: 'Country',
    username: 'Username',
    emailId: 'Email ID',
    referenceType: 'Reference Type',
    status: 'Status',
  };

  useEffect(() => {
    // Load designation list
    adminLoadDefaultfields().then((data) => {
      setDesgList(data.DESG || []);
    });

    // Load country list
    getAllLocations().then((data) => {
      setCountryList(data || []);
    });
  }, []);

  useEffect(() => {
    if (hospitalId) {
      setFormData((prev) => ({ ...prev, hospId: hospitalId }));
    }
  }, [hospitalId]);

  const validate = () => {
    const newErrors = {};

    Object.entries(formData).forEach(([field, value]) => {
      // Basic required check
      const isEmptyString = typeof value === 'string' && value.trim() === '';
      const isEmptyValue = value === null || value === undefined || isEmptyString;

      // 0 is allowed for dropdowns — don't treat as empty
      const isNumberField = ['designation', 'country', 'stateId', 'city'].includes(field);

      if (isEmptyValue && !(isNumberField && value === 0)) {
        newErrors[field] = `${FIELD_LABELS[field]} is required`;
      }
    });
    // Mobile number validation (basic: 10-digit number)
    const mobileRegex = /^[6-9]\d{9}$/;

    if (formData.mobileNo && !mobileRegex.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Mobile number must be a valid 10-digit Indian number';
    }

    if (formData.secondaryMob && !mobileRegex.test(formData.secondaryMob)) {
      newErrors.secondaryMob = 'Secondary mobile must be a valid 10-digit Indian number';
    }
    // 📧 Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.emailId && !emailRegex.test(formData.emailId)) {
      newErrors.emailId = 'Enter a valid email address';
    }

    if (formData.secondaryEmail && !emailRegex.test(formData.secondaryEmail)) {
      newErrors.secondaryEmail = 'Enter a valid secondary email address';
    }
    console.log('Validation Errors:', newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // handle cascading selects
    if (name === 'countryId') {
      const selectedCountry = countryList.find((c) => c.countryId === value);
      setStateList(selectedCountry?.states || []);
      setCityList([]);
      setFormData((prev) => ({ ...prev, stateId: '', cityId: '' }));
    }
    if (name === 'stateId') {
      const selectedState = stateList.find((s) => s.stateId === value);
      setCityList(selectedState?.cities || []);
      setFormData((prev) => ({ ...prev, cityId: '' }));
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      staffName: formData.staffName,
      gender: formData.gender,
      mobileNo: formData.mobileNo,
      secondaryMob: formData.secondaryMob,
      designation: formData.designation,
      degree: formData.degree,
      secondaryEmail: formData.secondaryEmail,
      // qualification: formData.qualification,
      address: formData.address,
      cityId: Number(formData.cityId),
      pinCode: Number(formData.pinCode),
      stateId: Number(formData.stateId),
      countryId: Number(formData.countryId),
      status: formData.status,
      username: formData.username,
      emailId: formData.emailId,
      referenceType: formData.referenceType,
      hospId: formData.hospId,
    };
    dispatch(updateBackdrop(true));

    adminStaffRegsitration(payload)
      .then((res) => {
        dispatch(updateBackdrop(false));
        setSuccessDialog(true);
        console.log('Payload to submit:', res);
        setApiResponse(res);
      })
      .catch((err) => {
        dispatch(updateBackdrop(false));
        console.log(err.response.data.errorMessage, 'Error');
        setApiError(err.response.data.errorMessage);
      });
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': { borderRadius: '8px' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CCCCCC' },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#04BA8E' },
  };

  return (
    <>
      {isSuccessDialogOpen && (
        <AdminUserSuccessDialog
          apiResponse={apiResponse}
          open={isSuccessDialogOpen}
          handleClose={() => {
            setSuccessDialog(false);
            navigate('/admin/dashboard');
          }}
        />
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ bgcolor: '#fff', p: 4, borderRadius: '16px' }}>
            <Container maxWidth='md' sx={{ py: 3 }}>
              <Box sx={{ bgcolor: '#04BA8E0A', p: 2, mb: 2, borderRadius: '8px' }}>
                <Typography variant='h6' sx={{ color: '#444', fontWeight: 600 }}>
                  Staff Registration
                </Typography>
              </Box>

              {apiError && (
                <Typography sx={{ color: 'red', my: 2, textAlign: 'center' }}>
                  {apiError}
                </Typography>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                  {/* Staff Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Staff Name*'
                      name='staffName'
                      value={formData.staffName}
                      onChange={handleChange}
                      error={Boolean(errors.staffName)}
                      helperText={errors.staffName}
                      sx={textFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Enter Your Username*'
                      name='username'
                      value={formData.username}
                      onChange={handleChange}
                      error={Boolean(errors.username)}
                      helperText={errors.username}
                      sx={textFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Enter your Degree*'
                      name='degree'
                      value={formData.degree}
                      onChange={handleChange}
                      error={Boolean(errors.degree)}
                      helperText={errors.degree}
                      sx={textFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Enter your Phone Number*'
                      name='mobileNo'
                      value={formData.mobileNo}
                      onChange={handleChange}
                      error={Boolean(errors.mobileNo)}
                      helperText={errors.mobileNo}
                      sx={textFieldStyles}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Enter your secondary Number*'
                      name='secondaryMob'
                      value={formData.secondaryMob}
                      onChange={handleChange}
                      error={Boolean(errors.secondaryMob)}
                      helperText={errors.secondaryMob}
                      sx={textFieldStyles}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Enter your Email Id*'
                      name='emailId'
                      type='email'
                      value={formData.emailId}
                      onChange={handleChange}
                      error={Boolean(errors.emailId)}
                      helperText={errors.emailId}
                      sx={textFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Enter Your Secondary Email Id*'
                      name='secondaryEmail'
                      type='email'
                      value={formData.secondaryEmail}
                      onChange={handleChange}
                      error={Boolean(errors.secondaryEmail)}
                      helperText={errors.secondaryEmail}
                      sx={textFieldStyles}
                    />
                  </Grid>
                  {/* Gender */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label='Gender*'
                      name='gender'
                      value={formData.gender}
                      onChange={handleChange}
                      error={Boolean(errors.gender)}
                      helperText={errors.gender}
                      sx={textFieldStyles}
                    >
                      <MenuItem value='M'>Male</MenuItem>
                      <MenuItem value='F'>Female</MenuItem>
                    </TextField>
                  </Grid>
                  {/* Designation */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label='Designation*'
                      name='designation'
                      value={formData.designation}
                      onChange={handleChange}
                      error={Boolean(errors.designation)}
                      helperText={errors.designation}
                      sx={textFieldStyles}
                    >
                      {desgList.map((option) => (
                        <MenuItem key={option.categoryId} value={option.categoryId}>
                          {option.categoryDetailName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label='Enter your referenceType*'
                      name='referenceType'
                      value={formData.referenceType}
                      onChange={handleChange}
                      error={Boolean(errors.referenceType)}
                      helperText={errors.referenceType}
                      sx={textFieldStyles}
                    >
                      {referenceTypeList.map((option) => (
                        <MenuItem key={option.categoryId} value={option.categoryId}>
                          {option.categoryDetailName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label='Status*'
                      name='status'
                      value={formData.status}
                      onChange={handleChange}
                      error={Boolean(errors.status)}
                      helperText={errors.status}
                      sx={textFieldStyles}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.categoryId} value={option.categoryId}>
                          {option.categoryDetailName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {/* Country */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label='Country*'
                      name='countryId'
                      value={formData.countryId}
                      onChange={handleChange}
                      error={Boolean(errors.countryId)}
                      helperText={errors.countryId}
                      sx={textFieldStyles}
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
                      label='State*'
                      name='stateId'
                      value={formData.stateId}
                      onChange={handleChange}
                      disabled={!formData.countryId}
                      error={Boolean(errors.stateId)}
                      helperText={errors.stateId}
                      sx={textFieldStyles}
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
                      label='City*'
                      name='cityId'
                      value={formData.cityId}
                      onChange={handleChange}
                      disabled={!formData.stateId}
                      error={Boolean(errors.cityId)}
                      helperText={errors.cityId}
                      sx={textFieldStyles}
                    >
                      {cityList.map((city) => (
                        <MenuItem key={city.cityId} value={city.cityId}>
                          {city.cityName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Enter your pinCode*'
                      name='pinCode'
                      value={formData.pinCode}
                      onChange={handleChange}
                      error={Boolean(errors.pinCode)}
                      helperText={errors.pinCode}
                      sx={textFieldStyles}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Address*'
                      name='address'
                      value={formData.address}
                      onChange={handleChange}
                      error={Boolean(errors.address)}
                      helperText={errors.address}
                      sx={textFieldStyles}
                    />
                  </Grid>
                </Grid>

                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  sx={{
                    mt: 3,
                    backgroundColor: '#04BA8E',
                    color: '#fff',
                    borderRadius: '8px',
                    py: 2,
                    '&:hover': { backgroundColor: '#04BA8E' },
                  }}
                >
                  Register
                </Button>
              </form>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default StaffRegistration;
