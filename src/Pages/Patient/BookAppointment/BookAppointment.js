import Header from '../../../Components/Header/header';
import TopNavbar from '../../../Components/TopNav/topNav';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Container,
  FormHelperText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { updateloginSignupAction } from '../../../Redux/Modules/Patient/HomeSlice';
import { fetchDoctorListThunk } from '../../../Redux/Modules/Patient/HomeThunk';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DoctorsList from '../../../Components/DoctorsList/DoctorsList';
import CircularProgress from '@mui/material/CircularProgress';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const BookAppointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 5 });
  const [searchQueryText, setsearchQueryText] = useState('');

  const { doctorListError, doctorList, doctorListLoading } = useSelector((state) => state.home);

  // Debounce logic: Update debouncedText after 300ms of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(searchText.trim());
    }, 1000);

    if (searchText.length >= 3) {
    }
    return () => clearTimeout(timer); // Cleanup the timeout on unmount or change
  }, [searchText]);

  useEffect(() => {
    if (debouncedText.length >= 3) {
      setError(false); // Clear error if valid input
      handleSearch(debouncedText);
    } else if (debouncedText.length === 0) {
      setError(false);
      handleSearch(''); // Trigger original API call when input is cleared
    } else if (debouncedText.length > 0) {
      setError(true); // Show error if input is invalid
    }
  }, [debouncedText]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchText(value);

    if (value.length === 0) {
      setError(false);
    } else if (value.length < 3) {
      setError(true);
    } else {
      setError(false);
    }
  };

  useEffect(() => {
    const trimmedText = searchQueryText.trim();
    const doctorPayload = {
      pagination: pagination,
    };

    if (trimmedText.length >= 3) {
      doctorPayload.data = {
        searchText: trimmedText,
      };
    }

    dispatch(fetchDoctorListThunk(doctorPayload));
  }, [pagination.page, pagination.size, searchQueryText]);

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  const handleSearch = (searchText) => {
    setsearchQueryText(searchText);
  };
  return (
    <>
      <TopNavbar />
      <Header />
      <Container>
        <Box sx={{ display: 'flex', mt: 6 }}>
          <Button
            onClick={() => {
              navigate('/patient/dashboard');
            }}
          >
            <ArrowBackIosIcon
              sx={{
                marginLeft: '4px',
                color: '#2B2A29',
                fontSize: 32,
              }}
            />{' '}
            <Typography sx={{ fontWeight: 600, color: '#2B2A29', fontSize: 32 }}>
              Book an appoinment
            </Typography>
          </Button>
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: '20px 0',
            mt: 6,
          }}
        >
          <Grid
            container
            justifyContent='center'
            spacing={2}
            sx={{
              // maxWidth: '1140px',
              width: '100%',
            }}
          >
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TextField
                  fullWidth
                  value={searchText}
                  onChange={(e) => handleChange(e)}
                  placeholder='Search for Doctors'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    sx: {
                      padding: '10px 14px', // Padding inside the text box
                    },
                  }}
                  error={error}
                  helperText={
                    error && (
                      <span style={{ fontSize: '16px', color: 'red' }}>
                        Please enter at least 3 characters.
                      </span>
                    )
                  }
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: error ? 'red' : '#6D6D6D', // Error border color
                      },
                      '&:hover fieldset': {
                        borderColor: error ? 'red' : '#04A393', // Hover with error
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: error ? 'red' : '#04A393', // Focused with error
                      },
                    },
                  }}
                />
                {/* {error && (
                  <FormHelperText
                    error
                    sx={{
                      marginTop: '-12px',
                      marginBottom: '16px',
                      color: 'red',
                    }}
                  >
                    Minimum 3 characters required to search.
                  </FormHelperText>
                )} */}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <>
        {doctorListLoading && (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 0',
              }}
            >
              <CircularProgress color='inherit' />
            </Box>
          </>
        )}
        {!doctorListLoading && doctorList?.content?.length > 0 ? (
          <>
            <Box
              sx={{
                backgroundColor: '#FBFBFB',
                margin: '32px 0 0 0',
                padding: '24px 0 0 0',
              }}
            >
              <Container>
                <Typography variant='h6' sx={{ color: '#2B2A29', fontSize: 24 }}>
                  {doctorList.totalElements} Doctors available
                </Typography>
              </Container>
            </Box>

            <DoctorsList
              // setLoginSignupDialogOpen={setLoginSignupDialogOpen}
              pagination={pagination}
              handlePageChange={handlePageChange}
              handleSizeChange={handleSizeChange}
            />
          </>
        ) : (
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            padding='64px 0'
            textAlign='center'
          >
            <LocalHospitalIcon sx={{ fontSize: 60, color: '#04BA8E', mb: 2 }} />

            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#3c3c3c' }}>
              No Doctors Found
            </Typography>

            <Typography variant='body1' sx={{ color: '#666' }}>
              Start searching by doctor name,
            </Typography>
          </Box>
        )}
      </>
    </>
  );
};

export default BookAppointment;
