import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Container, Button, Skeleton, Link } from '@mui/material';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

import Header from '../../../Components/Header/header';
import TopNavbar from '../../../Components/TopNav/topNav';
import Footer from '../../../Components/Footer/footer';

import { getPatientLabReportById } from '../../../Services/PatientServices';
import { useNavigate } from 'react-router-dom';
import { downloadReport } from '../../../Services/LabServices';
const LabReport = () => {
  const navigate = useNavigate();
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabReports = async () => {
      try {
        const userId = localStorage.getItem('regNo');
        const response = await getPatientLabReportById(userId);
        setLabReports(response.data.content || []);
      } catch (error) {
        console.error('Failed to fetch lab reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLabReports();
  }, []);

  const renderNoReportsPlaceholder = () => (
    <Container
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '60vh',
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          backgroundColor: '#E0F2F1',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <DescriptionOutlinedIcon sx={{ fontSize: 60, color: '#04BA8E' }} />
      </Box>
      <Typography variant='h5' sx={{ fontWeight: 600, mb: 1 }}>
        No Lab Reports Found
      </Typography>
      <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
        It looks like you don’t have any lab reports yet.
        <br />
        Please check back later or upload new reports.
      </Typography>
      <Button
        variant='contained'
        sx={{
          mt: 3,
          backgroundColor: '#04BA8E',
          color: '#fff',
          borderRadius: '8px',
          py: 2,
          '&:hover': {
            backgroundColor: '#04BA8E',
          },
        }}
        onClick={() => navigate('/patient/profile')}
      >
        Go Back Home
      </Button>
    </Container>
  );

  const renderSkeletonLoader = () => {
    const rows = Array.from({ length: 4 });

    return (
      <>
        <Skeleton variant='text' width={180} height={40} sx={{ mt: 6 }} />
        <Grid container spacing={2} sx={{ mt: 5 }}>
          {['Date', 'Reason', 'Report', 'Prescription'].map((_, idx) => (
            <Grid item xs={idx === 2 ? 4 : 3} key={idx}>
              <Skeleton variant='text' height={30} />
            </Grid>
          ))}
        </Grid>

        {rows.map((_, index) => (
          <Grid container spacing={2} key={index} sx={{ mt: 2 }}>
            <Grid item xs={3}>
              <Skeleton variant='text' height={25} />
            </Grid>
            <Grid item xs={2}>
              <Skeleton variant='text' width='80%' height={25} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant='rectangular' width='90%' height={25} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton variant='text' width='95%' height={25} />
            </Grid>
          </Grid>
        ))}
      </>
    );
  };
  const handleDownload = async (reportId, fileName) => {
    try {
      const blob = await downloadReport(reportId);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
  return (
    <>
      <TopNavbar />
      <Header />
      <Box sx={{ backgroundColor: '#F9F9F9' }}>
        <Container sx={{ py: 5 }}>
          {/* Back Button */}
          <Box sx={{ display: 'flex', pt: 6 }}>
            <Button onClick={() => navigate('/patient/profile')}>
              <ArrowBackIosIcon sx={{ marginLeft: '4px', color: '#2B2A29', fontSize: 24 }} />
              <Typography sx={{ fontWeight: 600, color: '#2B2A29', fontSize: 24 }}>
                Lab Reports
              </Typography>
            </Button>
          </Box>

          {loading ? (
            renderSkeletonLoader()
          ) : labReports.length > 0 ? (
            <>
              {/* Table Header */}
              <Grid
                container
                spacing={2}
                sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#6E6E6E',
                  mt: 5,
                }}
              >
                <Grid item xs={2}>
                  Date of Visit
                </Grid>
                <Grid item xs={2}>
                  Report Name
                </Grid>
                <Grid item xs={3}>
                  Categoryp
                </Grid>
                <Grid item xs={5}>
                  File Name
                </Grid>
              </Grid>

              {/* Lab Report Rows */}
              {labReports.map((report, index) => (
                <Grid
                  container
                  spacing={2}
                  key={report.id || index}
                  sx={{ mt: 1, color: '#2B2A29' }}
                >
                  <Grid item xs={2}>
                    <Typography>{report.reportDate}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography fontWeight='bold'>{report.reportName}</Typography>
                  </Grid>
                  <Grid item xs={3} display='flex' alignItems='center' gap={1}>
                    <PictureAsPdfIcon sx={{ color: '#D9534F' }} />
                    <Typography>{report.category}</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Button
                      onClick={() => handleDownload(report.id, report.fileName)}
                      sx={{
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        fontSize: 16,
                        textTransform: 'none',
                        padding: 0,
                      }}
                    >
                      {report.fileName}
                    </Button>
                  </Grid>
                </Grid>
              ))}
            </>
          ) : (
            renderNoReportsPlaceholder()
          )}
        </Container>
      </Box>
      <Box sx={{ pt: 6 }}>
        <Footer />
      </Box>
    </>
  );
};

export default LabReport;
