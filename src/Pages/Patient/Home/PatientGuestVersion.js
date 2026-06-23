import React, { useEffect, useState } from 'react';
import Header from '../../../Components/Header/header';
import TopNavbar from '../../../Components/TopNav/topNav';
import Banner from '../../../Components/Banner/Banner';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { styled } from '@mui/system';
import Diabatology from '../../../assets/Diabotology2.png';
import Neurology from '../../../assets/Neurology1.png';
import Odontology from '../../../assets/Ontology1.png';
import Pediatries from '../../../assets/Pediatries1.png';
import Gastroenterology from '../../../assets/Gastrology1.png';
import Dermatology from '../../../assets/Dermatology1.png';
import Nephrology from '../../../assets/NEPHROLOGY1.png';
import Oncology from '../../../assets/ONCOLOGY1.png';
import DoctorsList from '../../../Components/DoctorsList/DoctorsList';
import Footer from '../../../Components/Footer/footer';
import WhyChooseUs from '../../../Components/whychoosUs/whychooseUs';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SignUpLoginDialog from '../../../Components/Dialogs/SignUpLoginDialog/SignUpLoginDialog';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorListThunk } from '../../../Redux/Modules/Patient/HomeThunk';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useLocation } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// Styled container for the header section
const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  padding: theme.spacing(3),
  backgroundColor: '#fff',
}));

// Array of service boxes with labels and images
const services = [
  { label: 'DIABETOLOGY', image: Diabatology },
  { label: 'NEUROLOGY', image: Neurology },
  { label: 'Odontology', image: Odontology },
  { label: 'Pediatrics', image: Pediatries },
  { label: 'GASTROENTOLOGY', image: Gastroenterology },
  { label: 'DERMATOLOGY', image: Dermatology },
  { label: 'NEPHROLOGY', image: Nephrology },
  { label: 'ONCOLOGY', image: Oncology },
];
const PatientGuestVersion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginSignupDialogOpen, setLoginSignupDialogOpen] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [DocListLoad, setDocListLoad] = useState({ load: false, page: 0, size: 5 });
  const [pagination, setPagination] = useState({ page: 0, size: 6 });
  const [searchText, setsearchText] = useState('');
  const { doctorListError, doctorList, doctorListLoading, isUserLoggedIn } = useSelector(
    (state) => state.home
  );

  const handleOpen = () => {
    setLoginSignupDialogOpen(true);
  };

  useEffect(() => {
    const trimmedText = searchText.trim();
    const doctorPayload = {
      pagination: pagination,
    };

    if (trimmedText.length >= 3) {
      doctorPayload.data = {
        searchText: trimmedText,
      };
    }

    dispatch(fetchDoctorListThunk(doctorPayload));
  }, [pagination.page, pagination.size, searchText]);

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate('/patient/dashboard');
    }
  }, [isUserLoggedIn]);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const timer = setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
      navigate(location.pathname, { replace: true });
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSearch = (searchText) => {
    setsearchText(searchText);
  };
  return (
    <>
      <TopNavbar />
      <Header handleOpen={handleOpen} />
      <Banner
        setLoginSignupDialogOpen={setLoginSignupDialogOpen}
        setSearching={setSearching}
        handleSearch={handleSearch}
      />
      {isSearching && (
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
              <Box sx={{ backgroundColor: '#FBFBFB', margin: '32px 0 0 0', padding: '24px 0 0 0' }}>
                <Container>
                  <Typography variant='h6' sx={{ color: '#2B2A29', fontSize: 24 }}>
                    {doctorList.totalElements} Doctors available
                  </Typography>
                </Container>
              </Box>

              <DoctorsList
                setLoginSignupDialogOpen={setLoginSignupDialogOpen}
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
      )}
      <Box
        sx={{
          backgroundColor: 'rgba(4, 186, 142, 0.2)', // #04BA8E with 20% opacity
          padding: '16px 0', // Padding of 20px at top and bottom
          overflow: 'hidden', // To contain the marquee effect
          whiteSpace: 'nowrap', // Prevent text wrapping
        }}
      >
        <Box
          sx={{
            display: 'inline-block',
            animation: 'marquee 20s linear infinite', // Marquee animation
          }}
        >
          <Typography variant='h6' sx={{ color: '#3A3737', fontSize: 24, lineHeight: '48px' }}>
            Zcare – Your complete healthcare partner with 24/7 doctor availability, a broad range of
            specialties, hassle-free medicine & test ordering, and secure digitized health records –
            all in one place.
          </Typography>
        </Box>
        <style>
          {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
        </style>
      </Box>
      {/* <PromotionCards /> */}
      <Container id='department-section'>
        <HeaderContainer>
          <Typography
            variant='h4'
            align='center'
            sx={{
              color: '#2B2A29',
              fontSize: '32px',
            }}
          >
            Urgent Care & Occupational Medicine Clinic
          </Typography>
        </HeaderContainer>

        <Grid container spacing={3} justifyContent='center' padding={3}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 20px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(4, 186, 142, 0.04)',
                  borderRadius: '8px',
                  border: '1px solid rgba(4, 186, 142, 0.04)',
                  boxShadow: 3,
                  height: '300px', // Set the height of the box
                  color: '#333333',
                  textTransform: 'capitalize',
                }}
              >
                <img
                  src={service.image}
                  alt={service.label}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: '150px',
                    marginBottom: '16px',
                    borderRadius: '8px',
                    objectFit: 'contain',
                  }}
                />
                <Typography variant='h6'>{service.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {!isSearching && (
        <>
          <Container id='doctors-section'>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: { xs: '8px 16px', sm: '16px 24px' },
                flexDirection: { xs: 'column', sm: 'row' },
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              {/* Left side - Title and description */}
              <Box sx={{ marginBottom: { xs: '12px', sm: 0 } }}>
                {' '}
                {/* Space for mobile only */}
                <Typography
                  variant='h6'
                  component='div'
                  sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
                >
                  Doctors
                </Typography>
                <Typography
                  variant='body2'
                  color='textSecondary'
                  sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                >
                  Our team of experienced doctors are here to serve you
                </Typography>
              </Box>
            </Box>
          </Container>
          <DoctorsList
            setLoginSignupDialogOpen={setLoginSignupDialogOpen}
            pagination={pagination}
            handlePageChange={handlePageChange}
            handleSizeChange={handleSizeChange}
          />{' '}
        </>
      )}
      {/* <DoctorsList /> */}
      <SignUpLoginDialog
        open={isLoginSignupDialogOpen}
        onClose={() => {
          setLoginSignupDialogOpen(false);
        }}
      />
      <div id='about-section'>
        <WhyChooseUs />
      </div>
      <Footer />
    </>
  );
};

export default PatientGuestVersion;
