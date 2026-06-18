import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Box,
  Tab,
  Tabs,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AdminHeader from '../../../Components/Header/adminHeader';
import { styled } from '@mui/material/styles';
import StaffRegistration from '../StaffRegistration/StaffRegistration1';
import DoctorRegistration from '../DocterRegistration/DocterRegistration';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <AdminHeader />
      <Box sx={{ backgroundColor: '#F9F9F9' }}>
        <Container sx={{ py: 4 }}>
          <Box sx={{ my: 4 }}>
            <Button
              onClick={() => {
                navigate('/admin/dashboard');
              }}
            >
              <ArrowBackIosIcon
                sx={{
                  marginLeft: '4px',
                  color: '#2B2A29',
                  fontSize: 24,
                }}
              />{' '}
              <Typography sx={{ color: '#2B2A29', fontSize: 24, fontWeight: 600 }}>
                Go Back to Dashboard
              </Typography>
            </Button>
          </Box>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor='primary'
                indicatorColor='primary'
                sx={{
                  '& .MuiTabs-flexContainer': {
                    gap: 2, // Space between tabs
                  },
                  '& .MuiTab-root': {
                    borderRadius: '56px', // Rounded border
                    padding: '16px 32px', // Padding
                    textTransform: 'none', // Keep text normal case
                    fontWeight: 500,
                    fontSize: 18,
                    transition: 'all 0.3s ease',
                  },
                  '& .Mui-selected': {
                    background:
                      'linear-gradient(43deg, rgba(190, 243, 221, 0.104) 1.63%, rgba(236, 251, 250, 0.4) 81.43%)',

                    color: '#04BA8E', // Active tab text color
                    border: '1px solid #04BA8EB2',
                  },
                  '& .MuiTab-root:not(.Mui-selected)': {
                    backgroundColor: '#FFFFFF', // Inactive tab transparent
                    color: '#444444', // Normal text color
                    border: '1px solid #6E6E6E3D',
                  },
                  '& .MuiTab-root:hover': {
                    backgroundColor: '#E0F2F1', // Light hover effect
                  },
                  '& .MuiTabs-indicator': {
                    height: 0,
                    backdropClasses: 'none',
                  },
                }}
              >
                <Tab label='Doctor Registration' />
                <Tab label='Staff Registration' />
              </Tabs>
            </Box>
            {tabValue === 0 && <DoctorRegistration />}

            {tabValue === 1 && <StaffRegistration />}
          </Grid>
          {/* */}
        </Container>
      </Box>
    </>
  );
}
