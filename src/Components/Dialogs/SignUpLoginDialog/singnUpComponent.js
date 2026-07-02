import React, { useEffect, useState } from 'react';
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
import { updateloginSignupAction } from '../../../Redux/Modules/Patient/HomeSlice';
import { getSignUpOTPThunk } from '../../../Redux/Modules/Patient/HomeThunk';
import { useDispatch, useSelector } from 'react-redux';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';

const SignupComponent = ({ open, onClose, phoneNumber, setPhoneNumber }) => {
  const dispatch = useDispatch();
  const { signUpError } = useSelector((state) => state.home);
  const [country, setCountry] = useState('in');
  const [phoneNumberError, setphoneNumberError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const { appConfig, isConfigLoaded } = useSelector((state) => state.auth);
  const hospitalId = appConfig?.hospitalId;

  const onSubmit = (event) => {
    event.preventDefault();
    if (!phoneNumber && !email) {
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
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email');
        return;
      } else {
        setError('');
      }
    }

    let PhonenationalNumber = phoneNumber
      ? parsePhoneNumberFromString(phoneNumber, country.toUpperCase())
      : null;
    const loginBody = {
      mobileNumber: PhonenationalNumber.nationalNumber,
      hospitalId: hospitalId || '3',
    };

    dispatch(getSignUpOTPThunk(loginBody))
      .unwrap()
      .then((res) => {
        dispatch(updateloginSignupAction('signupotp'));
      })
      .catch((error) => {
        setError(error?.errorMessage);
        console.log('OTP API failed:', error);
        // Optional: show error toast or handle as needed
      });
  };

  const handleEmailId = (event) => {
    setEmail(event.target.value);

    setError('');
  };
  const handlePhoneNummber = (phone, country) => {
    setPhoneNumber(phone);
    setCountry(country.countryCode);
    setError('');
  };

  return (
    <>
      <form onSubmit={(event) => onSubmit(event)}>
        {/* <DialogTitle> */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='h6' sx={{ color: '#2B2A29' }}>
            Patient Registration
          </Typography>
          <CloseIcon onClick={onClose} sx={{ cursor: 'pointer', color: '#000' }} />
        </Box>
        <Typography variant='subtitle2' sx={{ color: '#868686' }}>
          STEP 1 OF 3
        </Typography>
        {/* </DialogTitle> */}
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
                  width: '100%',
                }}
                inputStyle={{ height: '40px', width: '100%' }}
              />
            </FormControl>

            {/* <Typography align='center' sx={{ color: '#6B7280', mt: 1 }}>
              or
            </Typography> */}

            {/* Email */}
            {/* <FormControl variant='outlined'>
              <Typography variant='body1' sx={{ color: '#868686', marginBottom: '8px' }}>
                Enter Your Email Id
              </Typography>
              <TextField
                autoFocus
                id='organizationId'
                value={email}
                onChange={(event) => handleEmailId(event)}
                margin='normal'
                size='small'
                variant='outlined'
                disabled={true}
                // error={organizationError ? true : false}
                // helperText={organizationError}
                sx={{
                  width: '350px',
                  marginTop: 0,
                  cursor: 'not-allowed', // 👈 This adds the disabled cursor
                  '& .MuiOutlinedInput-root.Mui-disabled': {
                    backgroundColor: '#f5f5f5', // Optional: make disabled field more obvious
                    color: 'rgba(0, 0, 0, 0.6)', // Optional: adjust text color
                    WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)', // Safari fix
                  },
                }}
              />
            </FormControl> */}

            {/* Error Message */}
            {error && <Typography sx={{ color: 'red', mx: 0.5 }}>{error}</Typography>}
          </Box>
          <Typography variant='body2' sx={{ color: '#6E6E6E', my: 1, fontSize: '12px' }}>
            An OTP will be sent to the mobile number address you entered.
          </Typography>
          <Typography variant='body2' sx={{ color: '#6E6E6E', mb: 1, fontSize: '12px' }}>
            Already having an account?{' '}
            <Typography
              component='span'
              onClick={() => {
                dispatch(updateloginSignupAction('login'));
              }}
              sx={{
                color: '#04BA8E',
                cursor: 'pointer',
              }}
            >
              Login
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

export default SignupComponent;
