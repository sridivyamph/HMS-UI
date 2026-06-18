import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  MenuItem,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EditProfileDialog = ({ open, onClose, initialData, onSubmit }) => {
  const [form, setForm] = useState({
    name: initialData.name || '',
    dob: initialData.dob || '',
    email: initialData.email || '',
    gender: initialData.gender || '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';

    if (!form.dob) newErrors.dob = 'Date of Birth is required';
    else if (new Date(form.dob) >= new Date()) newErrors.dob = 'Date of Birth must be in the past';

    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Email is not valid';

    if (!form.gender) newErrors.gender = 'Gender is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
      onClose();
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Name'
              value={form.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Date of Birth'
              type='date'
              InputLabelProps={{ shrink: true }}
              value={form.dob}
              onChange={handleChange('dob')}
              error={!!errors.dob}
              helperText={errors.dob}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Email'
              value={form.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label='Gender'
              value={form.gender}
              onChange={handleChange('gender')}
              error={!!errors.gender}
              helperText={errors.gender}
            >
              <MenuItem value='Male'>Male</MenuItem>
              <MenuItem value='Female'>Female</MenuItem>
              <MenuItem value='Other'>Other</MenuItem>
            </TextField>
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
