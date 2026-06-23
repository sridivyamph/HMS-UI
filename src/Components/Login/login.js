import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.svg';
import { useSelector } from 'react-redux';
import { adminLogin } from '../../Services/adminService';
import { handleAuthTokens } from '../../utils/GeneralFunction';

const CommonLogin = () => {
  const navigate = useNavigate();
  const { appConfig } = useSelector((state) => state.auth);

  useEffect(() => {}, [appConfig]);

  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(''); // ✅ New error state
  const [errors, setErrors] = useState({
    userName: '',
    password: '',
  });

  const validate = () => {
    const newErrors = {
      userName: '',
      password: '',
    };

    let isValid = true;

    if (!userName.trim()) {
      newErrors.userName = 'Username is required';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);

    const payload = {
      username: userName.trim(),
      password: password.trim(),
    };
    const param = appConfig.hospitalId || 3;

    adminLogin(payload, param)
      .then((res) => {
        handleAuthTokens(res.jwtToken);
        const role = localStorage.getItem('user_role');
        if (role === 'RECEPTIONIST') {
          navigate('/reception/dashboard');
        } else if (role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (role === 'DOCTOR') {
          navigate('/doctor/dashboard');
        } else if (role === 'LAB-TECHNICIAN') {
          navigate('/lab/dashboard');
        }
      })
      .catch((error) => {
        console.log(error, 'Error');
        setApiError(
          error?.response?.data?.errorMessage || 'Login failed. Please check your credentials.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
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

        {apiError && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        <form onSubmit={onSubmit} noValidate>
          <TextField
            fullWidth
            margin='normal'
            label='Enter Your Username'
            variant='outlined'
            value={userName}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prev) => ({ ...prev, userName: '' }));
              setApiError('');
            }}
            error={Boolean(errors.userName)}
            helperText={errors.userName}
          />

          <TextField
            fullWidth
            margin='normal'
            label='Enter Your Password'
            type='password'
            variant='outlined'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: '' }));
              setApiError('');
            }}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />

          {loading ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 2,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              sx={{
                backgroundColor: '#04BA8E',
                color: '#fff',
                borderRadius: '8px',
                mt: 2,
                '&:hover': {
                  backgroundColor: '#04BA8E',
                },
              }}
            >
              Login
            </Button>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default CommonLogin;
