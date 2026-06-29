import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, TextField, Button, MenuItem, Typography } from '@mui/material';
import {
  adminDoctorRegsitration,
  adminLoadDefaultfields,
  getAllLocations,
} from '../../../Services/adminService';
import AdminUserSuccessDialog from '../../../Components/Dialogs/AdminUserSuccessDialog/AdminUserSuccessDialog';
import { updateBackdrop } from '../../../Redux/Modules/Patient/HomeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DoctorRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appConfig } = useSelector((state) => state.auth);
  const hospitalId = appConfig?.hospitalId;

  const [formData, setFormData] = useState({
    name: '',
    doctorCode: '',
    departmentName: '',
    designation: '',
    specialization: '',
    degree: '',
    regNo: '',
    anesthetist: '',
    doctorType: '',
    phone: '',
    username: '',
    emailId: '',
    // referenceType: '',
    hospId: 3,
    secondaryEmail: '',
    secondaryMob: '',
    // pincode: '',
    city: '',
    address: '',
    country: '',
    stateId: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSuccessDialogOpen, setSuccessDialog] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [desgList, setDesgList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [docTypeList, setDocTypeList] = useState([]);
  const [specTypeList, setSpecTypeList] = useState([]);

  // ANESTHIS
  const [anesthetist, setanesthetist] = useState([
    { categoryId: 'Y', categoryDetailName: 'Yes' },
    { categoryId: 'N', categoryDetailName: 'No' },
  ]);

  // COUNTRY STATE CITY
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    if (hospitalId) {
      setFormData((prev) => ({ ...prev, hospId: hospitalId }));
    }
  }, [hospitalId]);
  const FIELD_LABELS = {
    name: 'Name',
    doctorCode: 'Doctor Code',
    departmentName: 'Department Name',
    designation: 'Designation',
    specialization: 'Specialization',
    degree: 'Degree',
    regNo: 'Doctor Reg. No',
    anesthetist: 'Anesthetist',
    doctorType: 'Doctor Type',
    phone: 'Phone Number',
    // pincode: 'Pin code',
    city: 'City',
    address: 'Address',
    country: 'Country',
    stateId: 'State',
    username: 'UserName',
    // referenceType: 'Reference',
    // hospId: 'HospId',
    emailId: 'Email Id',
    secondaryEmail: 'secondaryEmail',
    secondaryMob: 'secondaryMob',
  };

  useEffect(() => {
    adminLoadDefaultfields().then((data) => {
      setDesgList(data.DESG || []);
      setDeptList(data.DEPT || []);
      setDocTypeList(data.DOCTYPE || []);
      setSpecTypeList(data.SPECTYPE || []);
    });
  }, []);

  useEffect(() => {
    getAllLocations().then((data) => {
      setCountryList(data || []);
    });
  }, []);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/; // 10 digits only

    Object.entries(formData).forEach(([field, value]) => {
      // Basic required check
      const isEmptyString = typeof value === 'string' && value.trim() === '';
      const isEmptyValue = value === null || value === undefined || isEmptyString;

      // 0 is allowed for dropdowns — don't treat as empty
      const isNumberField = [
        'departmentName',
        'designation',
        'specialization',
        'doctorType',
        // 'hospId',
        'country',
        'stateId',
        'city',
      ].includes(field);

      if (isEmptyValue && !(isNumberField && value === 0)) {
        newErrors[field] = `${FIELD_LABELS[field]} is required`;
      }
      // Email validation
      if (field === 'emailId' && !isEmptyValue && !emailRegex.test(value)) {
        newErrors[field] = 'Enter a valid Email Id';
      }
      if (field === 'secondaryEmail' && value && !emailRegex.test(value)) {
        newErrors[field] = 'Enter a valid Secondary Email Id';
      }

      // Phone validation
      if (field === 'phone' && !isEmptyValue && !phoneRegex.test(value)) {
        newErrors[field] = 'Enter a valid 10-digit Phone Number';
      }
      if (field === 'secondaryMob' && value && !phoneRegex.test(value)) {
        newErrors[field] = 'Enter a valid 10-digit Secondary Phone Number';
      }
    });
    console.log('Validation Errors:', newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (validate()) {
      // API logic here
      console.log('Hitt');

      const payload = {
        deptId: formData.departmentName || 0,
        mobileNo: formData.phone,
        doctorCode: formData.doctorCode,
        doctorName: formData.name,
        address: formData.address,
        cityId: formData.city || 0,
        // pinCode: formData.pincode || 0,
        stateId: formData.stateId || 0,
        countryId: formData.country || 0,
        secondaryMob: formData.secondaryMob,
        designation: formData.designation || 0,
        specializationType: formData.specialization || 0,
        doctorRegNo: formData.regNo,
        anesthetist: formData.anesthetist,
        degree: formData.degree,
        admissionRight: formData.admissionRight || 'N',
        doctorType: formData.doctorType || 0,
        emailId: formData.emailId,
        status: 'A',
        secondaryEmail: formData.secondaryEmail,
        qualification: formData.qualification || formData.degree,
        hospId: formData.hospId,
        referenceType: 'DOCTOR',
        username: formData.username,
      };
      dispatch(updateBackdrop(true));
      adminDoctorRegsitration(payload)
        .then((res) => {
          dispatch(updateBackdrop(false));
          setSuccessDialog(true);

          setApiResponse(res);
        })
        .catch((err) => {
          dispatch(updateBackdrop(false));

          setApiError(err.response.data.errorMessage);
        });
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#CCCCCC',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#04BA8E',
    },
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
              <Box sx={{ bgcolor: '#04BA8E0A', p: '8px 10px', mb: 2, borderRadius: '8px' }}>
                <Typography variant='h6' sx={{ color: '#444444', fontWeight: 600 }}>
                  Doctor Registration
                </Typography>
              </Box>

              {apiError && (
                <Typography sx={{ color: 'red', mx: 0.5, my: 3, textAlign: 'center' }}>
                  {apiError}
                </Typography>
              )}
              <form onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                  {[
                    { name: 'name', label: 'Enter your Name*' },
                    { name: 'doctorCode', label: 'Enter your Doctor Code' },
                  ].map((field) => (
                    <Grid item xs={12} md={6} key={field.name}>
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={formData[field.name]}
                        type={'text'}
                        onChange={handleChange}
                        error={Boolean(errors[field.name])}
                        helperText={errors[field.name]}
                        sx={textFieldStyles}
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      type='number'
                      label='Enter your Department'
                      name='departmentName'
                      value={formData.departmentName}
                      onChange={handleChange}
                      error={Boolean(errors.departmentName)}
                      helperText={errors.departmentName}
                      sx={textFieldStyles}
                    >
                      {deptList.map((option) => (
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
                      type='number'
                      label='Specialization Type'
                      name='specialization'
                      value={formData.specialization}
                      onChange={handleChange}
                      error={Boolean(errors.specialization)}
                      helperText={errors.specialization}
                      sx={textFieldStyles}
                    >
                      {specTypeList.map((option) => (
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
                      type='number'
                      label='Enter your Designation'
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
                      label='Enter your Degree'
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
                      label='Enter your Doctor Reg. No'
                      name='regNo'
                      value={formData.regNo}
                      onChange={handleChange}
                      error={Boolean(errors.regNo)}
                      helperText={errors.regNo}
                      sx={textFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type='number'
                      select
                      label='Enter your Anesthetist'
                      name='anesthetist'
                      value={formData.anesthetist}
                      onChange={handleChange}
                      error={Boolean(errors.anesthetist)}
                      helperText={errors.anesthetist}
                      sx={textFieldStyles}
                    >
                      {anesthetist.map((option) => (
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
                      type='number'
                      label='Doctor Type'
                      name='doctorType'
                      value={formData.doctorType}
                      onChange={handleChange}
                      error={Boolean(errors.doctorType)}
                      helperText={errors.doctorType}
                      sx={textFieldStyles}
                    >
                      {docTypeList.map((option) => (
                        <MenuItem key={option.categoryId} value={option.categoryId}>
                          {option.categoryDetailName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Enter your Phone Number'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      error={Boolean(errors.phone)}
                      helperText={errors.phone}
                      sx={textFieldStyles}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Enter your secondary Number'
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
                      label='Enter your Email Id'
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
                      label='Enter Your Secondary Email Id'
                      name='secondaryEmail'
                      type='email'
                      value={formData.secondaryEmail}
                      onChange={handleChange}
                      error={Boolean(errors.secondaryEmail)}
                      helperText={errors.secondaryEmail}
                      sx={textFieldStyles}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Enter your User Name'
                      name='username'
                      value={formData.username}
                      onChange={handleChange}
                      error={Boolean(errors.username)}
                      helperText={errors.username}
                      sx={textFieldStyles}
                    />
                  </Grid>
                  {/* 
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Enter your referenceType'
                      name='referenceType'
                      value={formData.referenceType}
                      onChange={handleChange}
                      error={Boolean(errors.referenceType)}
                      helperText={errors.referenceType}
                      sx={textFieldStyles}
                    />
                  </Grid> */}
                  {/* <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Enter your Hospital Id'
                      name='hospId'
                      type='number'
                      value={formData.hospId}
                      onChange={handleChange}
                      error={Boolean(errors.hospId)}
                      helperText={errors.hospId}
                      sx={textFieldStyles}
                    />
                  </Grid> */}
                  {/* COUNTRY SELECT */}
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
                      sx={textFieldStyles}
                    >
                      {countryList.map((country) => (
                        <MenuItem key={country.countryId} value={country.countryId}>
                          {country.countryName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* STATE SELECT */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label='State'
                      name='stateId'
                      value={formData.stateId}
                      onChange={handleChange}
                      disabled={!formData.country} // disable if country not selected
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

                  {/* CITY SELECT */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label='City'
                      name='city'
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!formData.stateId} // disable if state not selected
                      error={Boolean(errors.city)}
                      helperText={errors.city}
                      sx={textFieldStyles}
                    >
                      {cityList.map((city) => (
                        <MenuItem key={city.cityId} value={city.cityId}>
                          {city.cityName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {/* <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Pin code'
                      name='pincode'
                      type='number'
                      value={formData.pincode}
                      onChange={handleChange}
                      error={Boolean(errors.pincode)}
                      helperText={errors.pincode}
                      sx={textFieldStyles}
                    />
                  </Grid> */}

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Address'
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
                    '&:hover': {
                      backgroundColor: '#04BA8E',
                    },
                  }}
                >
                  Register
                </Button>

                <Typography
                  variant='caption'
                  display='block'
                  sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}
                >
                  By clicking Continue, you agree to Doccure’s{' '}
                  <a href='#' style={{ color: '#04BA8E' }}>
                    Privacy Policy
                  </a>
                  ,{' '}
                  <a href='#' style={{ color: '#04BA8E' }}>
                    Terms and Conditions
                  </a>
                  .
                </Typography>
              </form>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default DoctorRegistration;
