import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  TextField,
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneInput from 'react-phone-input-2';
import { getLoginOTPThunk } from '../../../Redux/Modules/Patient/HomeThunk';
import { updateloginSignupAction } from '../../../Redux/Modules/Patient/HomeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';

const LoginComponent = ({ onClose, phoneNumber, setPhoneNumber, title }) => {
  const dispatch = useDispatch();
  const [country, setCountry] = useState('in');
  const [phoneNumberError, setphoneNumberError] = useState('');
  const [error, setError] = useState('');
  const { appConfig, isConfigLoaded } = useSelector((state) => state.auth);
  const hospitalId = appConfig?.hospitalId;
  const onSubmit = (event) => {
    event.preventDefault();
    if (!phoneNumber) {
      setError('Either phone number or email ID is required.');
      return;
    }
    if (phoneNumber) {
      let phoneNumberisValid = phoneNumber
        ? parsePhoneNumberFromString(phoneNumber, country.toUpperCase())
        : null;
      console.log(phoneNumberisValid, 'Ph');
      if (!phoneNumberisValid || !phoneNumberisValid.isValid()) {
        setError('Invalid phone number.');
        return false;
      }
    }

    let PhonenationalNumber = phoneNumber
      ? parsePhoneNumberFromString(phoneNumber, country.toUpperCase())
      : null;
    const loginBody = {
      mobileNumber: PhonenationalNumber.nationalNumber,
      hospitalId: hospitalId,
    };
    dispatch(getLoginOTPThunk(loginBody))
      .unwrap()
      .then((res) => {
        console.log('OTP sent:', res);
        dispatch(updateloginSignupAction('loginotp'));
      })
      .catch((error) => {
        console.log('Login OTP error:', error);
        setError(error?.errorMessage || 'Failed to send OTP'); // or show toast
      });
  };

  const handlePhoneNummber = (phone, country) => {
    setPhoneNumber(phone);
    setCountry(country.countryCode);
    setError('');
  };

  return (
    <>
      <form onSubmit={(event) => onSubmit(event)}>
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant='h6' sx={{ color: '#2B2A29' }}>
              {title}
            </Typography>
            <CloseIcon onClick={onClose} sx={{ cursor: 'pointer', color: '#000' }} />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 0.5 }}>
            {/* Phone Number */}
            <FormControl fullWidth variant='outlined'>
              <Typography variant='body1' sx={{ color: '#868686', marginBottom: '8px' }}>
                Enter Your Phone Number
              </Typography>
              <PhoneInput
                countryCodeEditable={false}
                value={phoneNumber}
                onChange={(phone, country) => handlePhoneNummber(phone, country)}
                country={country}
                containerStyle={{
                  height: '40px',
                  width: '350px',
                }}
                inputStyle={{ height: '40px', width: '350px' }}
              />
            </FormControl>
            {/* Error Message */}
            {error && <Typography sx={{ color: 'red', mx: 0.5 }}>{error}</Typography>}
          </Box>
          <Typography variant='body2' sx={{ color: '#6E6E6E', my: 1, fontSize: '12px' }}>
            An OTP will be sent to the mobile number by SMS.
          </Typography>
          <Typography variant='body2' sx={{ color: '#6E6E6E', mb: 1, fontSize: '12px' }}>
            Don't have an account?{' '}
            <Typography
              onClick={() => {
                dispatch(updateloginSignupAction('signup'));
              }}
              component='span'
              sx={{
                color: '#04BA8E',
                cursor: 'pointer',
              }}
            >
              Signup
            </Typography>
          </Typography>
          <Typography variant='body2' sx={{ fontSize: '12px', mb: 1, color: '#6B7280' }}>
            By clicking Proceed, you agree to Doccure’s{' '}
            <Typography
              component='span'
              sx={{
                color: '#04BA8E',
                cursor: 'pointer',
              }}
            >
              Privacy Policy, Terms and Conditions
            </Typography>
          </Typography>
          <Button
            variant='contained'
            fullWidth
            type='submit'
            sx={{
              backgroundColor: '#04BA8E',
              color: '#fff',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#04BA8E',
              },
            }}
          >
            Proceed
          </Button>
        </DialogContent>
      </form>
    </>
  );
};

export default LoginComponent;
