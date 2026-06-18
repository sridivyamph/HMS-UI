import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, TextField, InputAdornment, Container } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import BannerImage from '../../assets/Banner2.png';
import { updateloginSignupAction } from '../../Redux/Modules/Patient/HomeSlice';

const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_DELAY = 1000;

// Styled Components
const BannerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '48px 0',
  backgroundImage: `url(${BannerImage})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}));

const BoldText = styled(Typography)(({ theme }) => ({
  fontSize: '44px',
  marginBottom: '10px',
  color: '#3A3737',
  lineHeight: '72px',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.2rem',
  },
}));

const GreenText = styled('span')({
  color: '#04BA8E',
  fontWeight: 800,
});

const GreenTextName = styled('span')({
  color: '#04BA8E',
  fontWeight: 600,
  fontSize: 36,
});

const DescText = styled('span')({
  color: '#2B2A29',
  fontWeight: 400,
  fontSize: 18,
  fontFamily: 'Albert Sans',
  marginTop: 10,
});

const BannerButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '10px',
  marginTop: '20px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    width: '100%',
    button: {
      width: '100%',
    },
  },
}));

const Banner = ({ setLoginSignupDialogOpen, setSearching, userDetails, handleSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isUserLoggedIn } = useSelector((state) => state.home);

  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [error, setError] = useState(false);

  const name = userDetails?.name || 'User';

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedText = searchText.trim();
      setDebouncedText(trimmedText);
    }, DEBOUNCE_DELAY);

    setSearching(searchText.length >= MIN_SEARCH_LENGTH);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Handle debounced search text
  useEffect(() => {
    if (debouncedText.length >= MIN_SEARCH_LENGTH) {
      setError(false);
      handleSearch(debouncedText);
    } else if (debouncedText.length === 0) {
      setError(false);
      handleSearch('');
    } else if (debouncedText.length > 0) {
      setError(true);
    }
  }, [debouncedText]);

  // Input change handler
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    setError(value.length > 0 && value.length < MIN_SEARCH_LENGTH);
    setSearching(value.length >= MIN_SEARCH_LENGTH);
  };

  const handleBookAppointment = () => {
    if (!isUserLoggedIn) {
      dispatch(updateloginSignupAction('book'));
      setLoginSignupDialogOpen(true);
    } else {
      navigate('/patient/bookappointment');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#F5FCFA' }}>
      <Container>
        <BannerContainer>
          {!isUserLoggedIn ? (
            <BoldText variant='h3'>
              Convenient, Quality Walk-in Clinic in the
              <br />
              <GreenText>Heart of Chennai</GreenText>
            </BoldText>
          ) : (
            <>
              <BoldText variant='h3' fontSize={36} fontFamily='Albert Sans' color='#2B2A29'>
                Welcome <GreenTextName>{name}!</GreenTextName>
                <Box mt={2}>
                  <DescText>
                    We’re here to make healthcare simple. Discover trusted doctors, book
                    appointments instantly
                  </DescText>
                </Box>
              </BoldText>
            </>
          )}

          <BannerButtons>
            <Button
              variant='contained'
              onClick={handleBookAppointment}
              sx={{
                backgroundColor: '#04BA8E',
                color: '#FFFFFF',
                borderRadius: '56px',
                padding: '24px 56px',
                mt: -4,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#04BA8E',
                },
              }}
            >
              Book an appointment
            </Button>
          </BannerButtons>
        </BannerContainer>

        {/* Search Section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <Grid container justifyContent='center' spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                value={searchText}
                onChange={handleInputChange}
                placeholder='Search for Doctors'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { padding: '10px 14px' },
                }}
                error={error}
                helperText={error && 'Please enter at least 3 characters.'}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: error ? 'red' : '#6D6D6D',
                    },
                    '&:hover fieldset': {
                      borderColor: error ? 'red' : '#04A393',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: error ? 'red' : '#04A393',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Banner;
