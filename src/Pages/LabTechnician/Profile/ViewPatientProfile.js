import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Link,
  Accordion,
  TextField,
  AccordionSummary,
  AccordionDetails,
  Container,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Spinner from '../../../Components/Backdrop/Backdrop';
import { useState, useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Logo from '../../../assets/Logo.svg';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPatientProfileById } from '../../../Services/PatientServices';
import { useRef } from 'react';
import {
  uploadReportDoc,
  getPatientFiles,
  getGenericReportsList,
  addGenericReportsList,
  getListedReports,
  downloadReportDoc,
  deleteReportDoc,
} from '../../../Redux/Modules/LabTechnician/LabThunk';
import LabHeader from '../../../Components/Header/LabHeader';
import { useSelector } from 'react-redux';
import { findAllByPlaceholderText } from '@testing-library/react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

/*The Changes or updated needs to be done in the lab module :
    1.currently the app reports are hardcoded i.e add reports are Tests that needs to be done for patient are added by labTechie
    when that api is ready we can map then to those reports,
    2. later change those uploading parameters to dynamically change when new reports are added,
    3. Also add the status changes accordingly like after uploading the doc/report we update to done, else we can keep the status to pending
       or say upload report is pending so that they can know what are the options that are pending.
*/

const LabPatientProfile = () => {
  const { id } = useParams();
  const [userData, setuserData] = useState([]);
  const [isSpinner, setSpinner] = useState(false);

  const [anchorEl, setAnchorEl] = useState({});

  const fileInputRef = useRef(null);

  const [selectedGenericReportId, setSelectedGenericReportId] = useState(null);

  const dispatch = useDispatch();
  const handleUploadReport = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    // return;
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const dates = new Date();
    const formattedDate = dates.toISOString().split('T')[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientLabReportId', selectedGenericReportId.generalId);
    formData.append('patientId', id);
    formData.append('reportDate', formattedDate);
    formData.append('appointmentId', '');
    formData.append('genericReportId', selectedGenericReportId.GenericId);
    formData.append('hospitalId', 3);

    try {
      setSpinner(true);
      const response = await dispatch(uploadReportDoc(formData));
      console.log('Upload response:', response);
      ListLoader();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload report.');
    } finally {
      setSpinner(false);
    }
  };

  const navigate = useNavigate();
  const [detailsModal, setDetailsModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [availableReports, setAvailableReports] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  var ListLoader = async () => {
    const result = await dispatch(getListedReports(id));
    setSelectedReports(result.payload.content);
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  useEffect(() => {
    getPatientProfileById(id).then((val) => {
      const userObject = val.data;
      const dob = userObject.dateOfBirth || userObject.dob;
      const userDetailsArray = [
        { label: 'Name', value: userObject.name || 'N/A' },
        { label: 'Gender', value: userObject.gender || 'N/A' },
        { label: 'Age', value: calculateAge(dob) },
        { label: 'Email', value: userObject.email || userObject.secondaryEmail || 'N/A' },
        { label: 'Phone', value: userObject.mobileNo || 'N/A' },
      ];
      setuserData(userDetailsArray);
    });
  }, []);
  useEffect(() => {
    ListLoader();
  }, []);
  const handleAddingReports = async () => {
    const payload = {
      payload: searchText,
      param: 'page=0&size=50',
    };
    try {
      const response = await dispatch(getGenericReportsList(payload));
      console.log('response:', response);
      setAvailableReports(response.payload.content);
    } catch (error) {
      console.error('failed:', error);
    }
  };

  const [selectedReportsId, setselectedReportsId] = useState([]);
  const handleToggle = (id) => {
    setselectedReportsId((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const confirmGenRepSelection = async () => {
    console.log(selectedReportsId);
    setSpinner(true);
    const payload = {
      payload: { reportIds: selectedReportsId },
      param: id,
    };
    try {
      const response = await dispatch(addGenericReportsList(payload));
      ListLoader();
      console.log('response:', response);
    } catch (error) {
      console.error('failed:', error);
    } finally {
      setSpinner(false);
      setDetailsModal(false);
      setselectedReportsId([]);
    }
  };
  const handleClose = (index) => {
    setAnchorEl((prev) => ({
      ...prev,
      [index]: null,
    }));
  };
  const handleClick = (event, index) => {
    setAnchorEl((prev) => ({
      ...prev,
      [index]: event.currentTarget,
    }));
  };

  const linkToDownload = async (id, fileName) => {
    try {
      const result = await dispatch(downloadReportDoc(id));
      const blob = result.payload;
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

  const reportDeleter = async (id) => {
    setSpinner(true);
    const result = await dispatch(deleteReportDoc(id));
    ListLoader();
    console.log(result);
    setSpinner(false);
  };
  return (
    <>
      <LabHeader />
      <Box
        sx={{
          backgroundColor: '#F9F9F9',
          mb: 6,

          fontWeight: 500,
        }}
      >
        <Container>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 6,

              fontWeight: 500,
            }}
          >
            {/* Left-side Back Button + Title */}
            <Button
              onClick={() => {
                navigate(-1);
              }}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <ArrowBackIosIcon
                sx={{
                  marginLeft: '4px',
                  color: '#2B2A29',
                  fontSize: 24,
                }}
              />
              <Typography
                sx={{
                  color: '#2B2A29',
                  fontSize: 24,
                  ml: 1,

                  fontWeight: 500,
                }}
              >
                Patient Profile
              </Typography>
            </Button>

            <input
              type='file'
              accept='.pdf,.doc,.docx'
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleUploadReport}
            />

            {/* <Button
              variant="contained"
              sx={{color: "white" }}
              onClick={() => fileInputRef.current.click()}
            >
              Upload Report
            </Button> */}

            <Button
              variant='contained'
              sx={{
                backgroundColor: '#04BA8E',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: 600,
                textTransform: 'none',
                // height: 48,
                '&:hover': {
                  backgroundColor: '#04BA8E',
                },
              }}
              onClick={() => {
                setDetailsModal(true);
                handleAddingReports();
              }}
            >
              + Add Report
            </Button>
          </Box>
          <Spinner open={isSpinner} />
          <Modal open={detailsModal} onClose={() => setDetailsModal(false)}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70%',
                maxHeight: '80vh',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 3,
                overflowY: 'auto',

                fontWeight: 500,
              }}
            >
              <IconButton
                onClick={() => setDetailsModal(false)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: '#04BA8E',
                }}
              >
                <CloseIcon />
              </IconButton>
              <Typography
                variant='h6'
                gutterBottom
                sx={{
                  fontWeight: 500,
                }}
              >
                Add Report
              </Typography>

              <TextField
                label='Search reports'
                variant='outlined'
                fullWidth
                size='small'
                sx={{
                  mb: 2,

                  fontWeight: 500,
                }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      Subcategory
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      Test
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      Select
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableReports
                    .filter(
                      (report) =>
                        report.category.toLowerCase().includes(searchText.toLowerCase()) ||
                        report.keyElements.toLowerCase().includes(searchText.toLowerCase())
                    )
                    .map((report) => (
                      <TableRow key={report.id}>
                        <TableCell
                          sx={{
                            fontWeight: 500,
                          }}
                        >
                          {report.category}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 500,
                          }}
                        >
                          {report.subcategory}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 500,
                          }}
                        >
                          {report.testName}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 500,
                          }}
                        >
                          <Checkbox
                            checked={selectedReportsId.includes(report.id)}
                            onChange={() => handleToggle(report.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              <Box mt={3} textAlign='right'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    confirmGenRepSelection();
                  }}
                  sx={{
                    fontWeight: 500,
                  }}
                  disabled={selectedReportsId.length === 0}
                >
                  Add Selected
                </Button>
              </Box>
            </Box>
          </Modal>

          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={3}>
              <Card
                sx={{
                  borderRadius: '4px',
                  backgroundColor: '#04BA8E05',
                  border: '1px solid #04BA8E05',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar
                    src='https://via.placeholder.com/150'
                    alt='Don Crumb'
                    sx={{ width: 110, height: 110, mx: 'auto', mb: 2 }}
                  />

                  {/* User Details */}
                  <Box sx={{ mt: 2, textAlign: 'left' }}>
                    {userData.map((item, index) => (
                      <Box sx={{ pt: 2 }} key={item.label}>
                        <Typography
                          // key={index}//index is causing issues with the key prop of not  being unique
                          variant='body1'
                          sx={{
                            fontSize: 16,
                            fontWeight: 500,
                          }}
                          color='#6E6E6E'
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          key={index}
                          variant='body1'
                          sx={{
                            fontWeight: 500, // Medium weight
                            fontStyle: 'normal',
                            fontSize: 16,
                            lineHeight: '24px',
                            letterSpacing: 0,
                          }}
                          color='#6E6E6E'
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={9}>
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  py: '40px',
                  px: '24px',
                  overflowX: 'auto',
                }}
              >
                {[
                  {
                    title: 'Past Lab Reports',
                    data: selectedReports,
                  },
                ].map((section, idx) => (
                  <Accordion
                    key={idx}
                    sx={{
                      mb: 2,
                      backgroundColor: '#04BA8E0A',
                      borderRadius: 1,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#04BA8E' }} />}
                      sx={{
                        fontStyle: 'normal', // font-style can only be normal, italic, oblique
                        fontSize: '18px', // from design spec
                        lineHeight: '20px',
                        letterSpacing: 0,
                        color: '#444444',
                        fontWeight: 500,
                      }}
                    >
                      {section.title}
                    </AccordionSummary>
                    <AccordionDetails>
                      {section.data.length > 0 ? (
                        <Grid spacing={2} container backgroundColor='#fff' sx={{ py: 2, px: 2 }}>
                          <>
                            <Grid item xs={3}>
                              <Typography variant='h6' sx={{ color: '#04BA8E' }}>
                                Report Name
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography variant='h6' sx={{ color: '#04BA8E' }}>
                                Date
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography variant='h6' sx={{ color: '#04BA8E' }}>
                                Subcategory
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant='h6' sx={{ color: '#04BA8E' }}>
                                Status
                              </Typography>
                            </Grid>
                            <Grid item xs={1}></Grid>
                            {section.data.map((record, index) => (
                              <React.Fragment key={index}>
                                <Grid item xs={3}>
                                  <Typography variant='subtitle2'> {record.reportName}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography variant='subtitle2'> {record.reportDate}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography variant='subtitle2'> {record.subcategory}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                  <Typography variant='subtitle2'> </Typography>
                                  <Box
                                    sx={{
                                      display: 'inline-block',
                                      px: 2,
                                      py: 0.5,
                                      borderRadius: '20px',
                                      bgcolor:
                                        record.reportStatus === 'Completed'
                                          ? 'rgba(0, 200, 83, 0.1)'
                                          : 'rgba(255, 152, 0, 0.1)',
                                    }}
                                  >
                                    <Typography
                                      variant='subtitle2'
                                      sx={{
                                        color:
                                          record.reportStatus === 'Completed'
                                            ? 'success.main'
                                            : 'warning.main',
                                        fontWeight: 500,
                                      }}
                                    >
                                      {record.reportStatus}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={1}>
                                  <IconButton size='small' onClick={(e) => handleClick(e, index)}>
                                    <MoreVertIcon />
                                  </IconButton>
                                  <Menu
                                    anchorEl={anchorEl[index]}
                                    open={Boolean(anchorEl[index])}
                                    onClose={() => handleClose(index)}
                                    anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                      vertical: 'top',
                                      horizontal: 'right',
                                    }}
                                    PaperProps={{
                                      sx: {
                                        borderRadius: 2,
                                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                        p: 1,
                                        minWidth: 220,
                                      },
                                    }}
                                  >
                                    {/* Upload Report */}
                                    <MenuItem
                                      onClick={() => {
                                        setSelectedGenericReportId({
                                          generalId: record.id,
                                          GenericId: record.genericReportId,
                                        });
                                        fileInputRef.current.click();
                                      }}
                                      sx={{
                                        px: 2,
                                        py: 1,
                                        '&:hover': {
                                          bgcolor: '#E6F7F3',
                                        },
                                      }}
                                    >
                                      <ListItemIcon sx={{ color: '#04BA8E' }}>
                                        <UploadFileIcon fontSize='small' />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary='Upload Report'
                                        sx={{ fontWeight: 500 }}
                                      />
                                    </MenuItem>

                                    {/* Download (if not pending) */}
                                    {record?.reportStatus !== 'Pending' && (
                                      <MenuItem
                                        onClick={() => linkToDownload(record.id, record.fileName)}
                                        sx={{
                                          px: 2,
                                          py: 1,
                                          '&:hover': {
                                            bgcolor: '#E6F7F3',
                                          },
                                        }}
                                      >
                                        <ListItemIcon sx={{ color: '#04BA8E' }}>
                                          <DownloadIcon fontSize='small' />
                                        </ListItemIcon>
                                        <ListItemText primary='Download' sx={{ fontWeight: 500 }} />
                                      </MenuItem>
                                    )}

                                    {/* Delete Report */}
                                    <MenuItem
                                      onClick={() => reportDeleter(record.id)}
                                      sx={{
                                        px: 2,
                                        py: 1,
                                        '&:hover': {
                                          bgcolor: '#E6F7F3',
                                        },
                                      }}
                                    >
                                      <ListItemIcon sx={{ color: '#04BA8E' }}>
                                        <DeleteIcon fontSize='small' />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary='Delete Report'
                                        sx={{ fontWeight: 500 }}
                                      />
                                    </MenuItem>
                                  </Menu>

                                  {/* {record.action} */}
                                </Grid>
                              </React.Fragment>
                            ))}
                          </>
                        </Grid>
                      ) : (
                        <Typography variant='body2' color='textSecondary'>
                          No records available.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* <Footer /> */}
    </>
  );
};

export default LabPatientProfile;
