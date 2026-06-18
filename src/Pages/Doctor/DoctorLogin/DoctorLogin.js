import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { doctorLoginCall } from '../../../Redux/Modules/Doctor/DoctorThunk';
import Logo from '../../../assets/Logo.svg';
import { useNavigate } from 'react-router-dom';
import {
  updateReceptionLogin,
  updateReceptionTokenAction,
} from '../../../Redux/Modules/Reception/ReceptionSlice';

const DoctorLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const doctorLoginResponse = useSelector((state) => state.doctor);
  const isLoginError = useSelector((state) => state.doctor?.isErrorFound);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!doctorLoginResponse?.isLoading && doctorLoginResponse?.isNavigate) {
      try {
        navigate('/doctor/dashboard');
        localStorage.setItem('isDoctorLogin', true);
      } catch (error) {}
    }
  }, [doctorLoginResponse?.isLoginSuccess]);
  const LoginAction = () => {
    if (username && password !== '') {
      dispatch(
        doctorLoginCall({
          username: username,
          password: password,
        })
      );
      setValidationError(false);
    } else {
      setValidationError(true);
    }
  };
  return (
    <>
      <Container
        maxWidth='xs'
        sx={{
          display: 'flex',
          height: 'calc(100vh - 64px)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <img src={Logo} alt='Logo' style={{ width: 100, marginBottom: 16 }} />
          <Typography variant='h5' gutterBottom>
            Login
          </Typography>
          <TextField
            fullWidth
            margin='normal'
            label='Username'
            variant='outlined'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Password'
            type='password'
            variant='outlined'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isLoginError && (
            <Typography variant='h5' gutterBottom>
              Error Found
            </Typography>
          )}
          {validationError && (
            <Typography variant='h8' color={'red'} gutterBottom>
              Please enter the required fields
            </Typography>
          )}
          <Button
            variant='contained'
            color='primary'
            fullWidth
            type='submit'
            sx={{
              backgroundColor: '#04BA8E',
              color: '#fff',
              mt: 2,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#04BA8E',
              },
            }}
            onClick={() => LoginAction()}
          >
            Login
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default DoctorLogin;
