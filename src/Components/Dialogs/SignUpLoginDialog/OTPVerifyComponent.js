import React, { useState, useEffect } from 'react';
import { Box, DialogContent, Typography, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PhoneInput from 'react-phone-input-2';
import {
  verifySignUpOTPThunk,
  verifyLoginOTPThunk,
} from '../../../Redux/Modules/Patient/HomeThunk';
import { useDispatch, useSelector } from 'react-redux';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { updateloginSignupAction } from '../../../Redux/Modules/Patient/HomeSlice';

const OTPVerifyComponent = ({ phoneNumber, onClose, loginSignUpAction }) => {
  const formattedNumber = phoneNumber;
  const { otpVerifyError } = useSelector((state) => state.home);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [otpError, setOtpError] = useState(otpVerifyError || '');
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const dispatch = useDispatch();

  // Timer logic
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setResendEnabled(true);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleResendOTP = () => {
    setTimer(60);
    setResendEnabled(false);

    // Trigger resend logic here — e.g., call an API
    const parsedNumber = parsePhoneNumberFromString(phoneNumber, 'IN');
    const resendBody = { mobileNumber: parsedNumber?.nationalNumber };

    // You can call your resend API here if you have one
    // e.g., dispatch(resendOTPThunk(resendBody))

    console.log('Resending OTP to:', resendBody);
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpError('');
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (otp.some((digit) => digit === '')) {
      setOtpError('OTP is required.');
      return;
    }

    let PhonenationalNumber = phoneNumber ? parsePhoneNumberFromString(phoneNumber, 'IN') : null;
    const otpFormat = otp.join('');
    const otpBody = {
      mobileNumber: PhonenationalNumber.nationalNumber,
      otp: otpFormat,
    };

    const action = loginSignUpAction === 'loginotp' ? verifyLoginOTPThunk : verifySignUpOTPThunk;

    dispatch(action(otpBody))
      .unwrap()
      .then((res) => {
        if (loginSignUpAction === 'loginotp') {
          onClose();
        } else {
          dispatch(updateloginSignupAction('register'));
        }
      })
      .catch((error) => {
        setOtpError(error?.errorMessage);
      });
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h6' sx={{ color: '#2B2A29' }}>
            OTP Verification
          </Typography>
          <CloseIcon onClick={onClose} sx={{ cursor: 'pointer', color: '#000' }} />
        </Box>
        <Typography variant='subtitle2' sx={{ color: '#868686' }}>
          STEP 2 OF 3
        </Typography>

        <DialogContent>
          <Box>
            <Typography
              variant='h6'
              fontSize={16}
              fontFamily={'Albert Sans'}
              fontWeight={400}
              sx={{ color: '#2B2A29' }}
            >
              Please enter the 6 digit OTP number sent to
            </Typography>
            <Typography
              variant='h6'
              fontSize={16}
              fontFamily={'Albert Sans'}
              fontWeight={500}
              marginTop={1}
              color='#2B2A29'
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {formattedNumber}
              <EditIcon
                sx={{ cursor: 'pointer', color: '#000', ml: 0.5 }}
                onClick={() => {
                  const action = loginSignUpAction === 'loginotp' ? 'login' : 'signup';
                  dispatch(updateloginSignupAction(action));
                }}
              />
            </Typography>
          </Box>

          <Box display='flex' gap={3} justifyContent='center' mt={2} mb={1}>
            {otp.map((value, index) => (
              <TextField
                key={index}
                id={`otp-input-${index}`}
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                variant='outlined'
                sx={{
                  textAlign: 'center',
                  width: '54px',
                  height: '54px',
                  borderRadius: '8px',
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    padding: '10px',
                  },
                }}
                inputProps={{ maxLength: 1 }}
              />
            ))}
          </Box>

          {otpError && <Typography sx={{ color: 'red', mx: 0.5 }}>{otpError}</Typography>}

          <Box
            component='div'
            sx={{ color: '#04BA8E', display: 'flex', alignItems: 'center', mt: 1 }}
          >
            <Typography variant='h6' sx={{ color: '#6E6E6E', fontSize: 12 }}>
              Haven’t received OTP?
            </Typography>
            {!resendEnabled ? (
              <Typography sx={{ ml: 1, fontSize: 12, color: '#6E6E6E' }}>
                Resend in {timer}s
              </Typography>
            ) : (
              <Box
                component='span'
                sx={{ ml: 1, fontSize: 12, color: '#04BA8E', cursor: 'pointer' }}
                onClick={handleResendOTP}
              >
                Resend OTP
              </Box>
            )}
          </Box>

          <Button
            variant='contained'
            fullWidth
            type='submit'
            sx={{
              backgroundColor: '#04BA8E',
              color: '#fff',
              borderRadius: '8px',
              mt: 2,
              '&:hover': { backgroundColor: '#04BA8E' },
            }}
          >
            Proceed
          </Button>
        </DialogContent>
      </form>
    </>
  );
};

export default OTPVerifyComponent;
