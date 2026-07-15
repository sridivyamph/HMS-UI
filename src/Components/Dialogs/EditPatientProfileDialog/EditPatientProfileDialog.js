import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  MenuItem,
  DialogActions,
  Button,
} from '@mui/material';
import { getAllLocations } from '../../../Services/adminService';

const EditProfileDialog = ({ open, onClose, initialData, onSubmit }) => {
  const [form, setForm] = useState({
    name: initialData.name || '',
    dob: initialData.dob || '',
    gender: initialData.gender || '',
    secondaryMobile: initialData.secondaryMobile || '',
    secondaryEmail: initialData.secondaryEmail || '',
    country: initialData.country || '',
    stateId: initialData.stateId || '',
    city: initialData.city || '',
    address: initialData.address || '',
    pin: initialData.pin || '',
  });

  const [errors, setErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    if (open) {
      getAllLocations().then((data) => {
        setCountryList(data || []);
      });
    }
  }, [open]);

  useEffect(() => {
    if (initialData.country) {
      const selectedCountry = countryList.find((c) => c.countryId === initialData.country);
      setStateList(selectedCountry?.states || []);
    }
    if (initialData.stateId) {
      const selectedState = stateList.find((s) => s.stateId === initialData.stateId);
      setCityList(selectedState?.cities || []);
    }
  }, [open]);

  useEffect(() => {
    setForm({
      name: initialData.name || '',
      dob: initialData.dob || '',
      gender: initialData.gender || '',
      secondaryMobile: initialData.secondaryMobile || '',
      secondaryEmail: initialData.secondaryEmail || '',
      country: initialData.country || '',
      stateId: initialData.stateId || '',
      city: initialData.city || '',
      address: initialData.address || '',
      pin: initialData.pin || '',
    });
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.dob) newErrors.dob = 'Date of Birth is required';
    else if (new Date(form.dob) >= new Date()) newErrors.dob = 'Date of Birth must be in the past';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (form.secondaryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.secondaryEmail)) {
      newErrors.secondaryEmail = 'Enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'country') {
      const selectedCountry = countryList.find((c) => c.countryId === value);
      setStateList(selectedCountry?.states || []);
      setCityList([]);
      setForm((prev) => ({ ...prev, country: value, stateId: '', city: '' }));
    }

    if (name === 'stateId') {
      const selectedState = stateList.find((s) => s.stateId === value);
      setCityList(selectedState?.cities || []);
      setForm((prev) => ({ ...prev, stateId: value, city: '' }));
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name='name'
              label='Name*'
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name='dob'
              label='Date of Birth*'
              type='date'
              InputLabelProps={{ shrink: true }}
              value={form.dob}
              onChange={handleChange}
              error={!!errors.dob}
              helperText={errors.dob}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name='gender'
              label='Gender*'
              select
              value={form.gender}
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
              name='secondaryMobile'
              label='Secondary Mobile'
              value={form.secondaryMobile}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name='secondaryEmail'
              label='Secondary Email'
              value={form.secondaryEmail}
              onChange={handleChange}
              error={!!errors.secondaryEmail}
              helperText={errors.secondaryEmail}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              name='country'
              label='Country'
              value={form.country}
              onChange={handleChange}
            >
              {countryList.map((country) => (
                <MenuItem key={country.countryId} value={country.countryId}>
                  {country.countryName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              name='stateId'
              label='State'
              value={form.stateId}
              onChange={handleChange}
              disabled={!form.country}
            >
              {stateList.map((state) => (
                <MenuItem key={state.stateId} value={state.stateId}>
                  {state.stateName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              name='city'
              label='City'
              value={form.city}
              onChange={handleChange}
              disabled={!form.stateId}
            >
              {cityList.map((city) => (
                <MenuItem key={city.cityId} value={city.cityId}>
                  {city.cityName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name='pin'
              label='Pincode'
              value={form.pin}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name='address'
              label='Address'
              multiline
              rows={2}
              value={form.address}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='inherit'>
          Cancel
        </Button>
        <Button variant='contained' onClick={handleSubmit} sx={{ backgroundColor: '#04BA8E' }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
