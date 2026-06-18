import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';

export default function OtpView() {
  const [otp, setOtp] = useState(new Array(6).fill(''));

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.match(/^[0-9]$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically focus next input
      if (index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    } else if (value === '') {
      // Allow deletion of character to empty the box
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      // Focus the previous input on backspace if current box is empty
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  return (
    <Box display="flex" gap={3} justifyContent="center" mt={2} mb={3}>
      {otp.map((digit, index) => (
        <TextField
          key={index}
          id={`otp-input-${index}`}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          variant="outlined"
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: 'center',
              width: '25px',
              height: '25px',
              fontSize: '20px',
            },
          }}
        />
      ))}
    </Box>
  );
}
