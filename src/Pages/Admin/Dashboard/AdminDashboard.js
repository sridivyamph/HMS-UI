import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Paper,
  Menu,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  InputAdornment,
  TableRow,
  Button,
  Container,
  TablePagination,
  Skeleton,
} from '@mui/material';
import { useEffect, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DocHeader from '../../../Components/Header/DocHeader';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDoctorUpcomingAppointmentsList,
  fetchDoctorPreviousAppointmentsList,
} from '../../../Redux/Modules/Doctor/DoctorThunk';
import AdminHeader from '../../../Components/Header/adminHeader';
import { adminListUsers } from '../../../Services/adminService';
import SearchIcon from '@mui/icons-material/Search';

const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_DELAY = 1000;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [userList, setuserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const dispatch = useDispatch();

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  useEffect(() => {
    setLoading(true);

    adminListUsers({
      page: pagination.page,
      size: pagination.size,
      searchQuery: debouncedText, // debouncedText should be your search input
    })
      .then((data) => {
        setLoading(false);

        setuserList(data);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [pagination.page, pagination.size, debouncedText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedText = searchText.trim();
      setDebouncedText(trimmedText);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchText]);
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
  };

  return (
    <>
      <AdminHeader />
      <Box sx={{ backgroundColor: '#F9F9F9' }}>
        <Container sx={{ py: 4 }}>
          <Grid
            container
            spacing={2}
            sx={{ mt: 6, backgroundColor: '#fff', borderRadius: '32px', p: 1 }}
          >
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  gap: 2, // space between search and button
                }}
              >
                {/* Search Box */}
                <TextField
                  placeholder='Search Patients'
                  variant='outlined'
                  fullWidth
                  value={searchText}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon sx={{ color: 'gray.500' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '8px',
                      height: 48,
                    },
                  }}
                  sx={{ flex: '0 0 65%' }} // 👈 70% width
                />

                {/* Add Appointment Button */}
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={() => {
                    navigate('/admin/adduser');
                  }}
                  sx={{
                    flex: '0 0 30%', // 👈 30% width
                    backgroundColor: '#04BA8E',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    height: 48,
                    '&:hover': {
                      backgroundColor: '#04BA8E',
                    },
                  }}
                >
                  Add User
                </Button>
              </Box>
            </Grid>

            {/* Appointments Table */}
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#04BA8E0A' }}>
                    <TableRow>
                      <TableCell>Name</TableCell>

                      <TableCell>Email</TableCell>
                      <TableCell>Mobile No</TableCell>

                      <TableCell>Qualification</TableCell>
                      <TableCell>Role</TableCell>

                      {/* <TableCell>Actions</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      Array.from(new Array(pagination.size)).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Skeleton variant='text' />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant='text' />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant='text' />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant='text' />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant='text' />
                          </TableCell>
                          <TableCell>
                            <Skeleton
                              variant='rectangular'
                              animation='wave'
                              width={100}
                              height={32}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <>
                        {userList?.content?.length > 0 &&
                          userList.content.map((user, index) => (
                            <TableRow
                              sx={{
                                backgroundColor: '#fff',

                                borderRadius: 2, // Rounded corners
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Light shadow for separation
                                my: 2, // Space between rows (marginY)
                              }}
                              key={index}
                            >
                              <TableCell>{user.name}</TableCell>

                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.mobile}</TableCell>

                              <TableCell>{user.qualification}</TableCell>
                              <TableCell>{user.role}</TableCell>
                              {/* <TableCell>
                                  <Button
                                    onClick={() =>
                                      navigate(`/doctor/patientProfile/${user.patientId}`)
                                    }
                                    sx={{
                                      color: '#04BA8E',
                                      textDecoration: 'underline',
                                      fontSize: 14,
                                      fontWeight: 500,
                                    }}
                                    size='small'
                                  >
                                    View Details
                                  </Button>
                                </TableCell> */}
                            </TableRow>
                          ))}
                      </>
                    )}
                  </TableBody>

                  {/* <TableBody sx={{ backgroundColor: 'red' }}>
                  
                  </TableBody> */}
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component='div'
                count={userList?.page?.totalElements}
                rowsPerPage={pagination?.size}
                page={pagination?.page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleSizeChange}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AdminDashboard;
