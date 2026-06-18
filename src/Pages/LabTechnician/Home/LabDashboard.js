import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  Box,
  MenuItem,
  TablePagination,
  InputAdornment,
  Skeleton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LabHeader from '../../../Components/Header/LabHeader';
import SearchIcon from '@mui/icons-material/Search';
import { getAllPatientsList } from '../../../Services/LabServices';

const DEBOUNCE_DELAY = 1000;

const LabDashboard = () => {
  const navigate = useNavigate();

  const [sortOption, setSortOption] = useState('date');
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(searchText.trim());
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Fetch data when page, size, or search changes
  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.size, debouncedText]);

  // Re-sort when sort option changes
  useEffect(() => {
    if (userList?.content?.length) {
      const sorted = sortPatients(userList.content, sortOption);
      setUserList((prev) => ({ ...prev, content: sorted }));
    }
  }, [sortOption]);

  const fetchData = () => {
    setLoading(true);

    let params = `page=${pagination.page}&size=${pagination.size}`;
    if (debouncedText) {
      params += `&searchText=${debouncedText}`;
    }

    getAllPatientsList(params)
      .then((data) => {
        const sorted = sortPatients(data.content || [], sortOption);
        setUserList({ ...data, content: sorted });
      })
      .catch((err) => {
        console.error('Error fetching patients:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const sortPatients = (data = [], sortOption) => {
    return [...data].sort((a, b) => {
      if (sortOption === 'name') {
        const nameA = a.name?.trim().toLowerCase() || '';
        const nameB = b.name?.trim().toLowerCase() || '';
        return nameA.localeCompare(nameB);
      }
      if (sortOption === 'date') {
        return new Date(b.createdDate) - new Date(a.createdDate);
      }
      return 0;
    });
  };

  const handlePageChange = (_, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPagination({ page: 0, size: newSize });
  };

  const handleInputChange = (e) => setSearchText(e.target.value);

  const handleSortChange = (e) => setSortOption(e.target.value);

  const renderSkeletonRows = (count) =>
    Array.from({ length: count }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton variant='text' />
        </TableCell>
        <TableCell>
          <Skeleton variant='text' />
        </TableCell>
        <TableCell>
          <Skeleton variant='rectangular' width={80} height={30} />
        </TableCell>
      </TableRow>
    ));

  return (
    <Box
      sx={{
        backgroundColor: '#F9F9F9',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LabHeader />
      <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Search & Sort */}
        <Grid container spacing={2} alignItems='center' mt={2}>
          <Grid item xs={9}>
            <TextField
              fullWidth
              label='Search Reports by Patient Name or Phone'
              variant='outlined'
              value={searchText}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon sx={{ color: 'gray.500' }} />
                  </InputAdornment>
                ),
                sx: { height: 48 },
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <Select fullWidth value={sortOption} onChange={handleSortChange}>
              <MenuItem value='date'>Sort by Date</MenuItem>
              <MenuItem value='name'>Sort by Name</MenuItem>
            </Select>
          </Grid>
        </Grid>

        {/* Report Table */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TableContainer component={Paper} sx={{ mt: 4, flexGrow: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '40%', fontWeight: 500 }}>Patient Name</TableCell>
                  <TableCell sx={{ width: '40%', fontWeight: 500 }}>Phone No</TableCell>
                  <TableCell sx={{ width: '20%', fontWeight: 500 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? renderSkeletonRows(pagination.size)
                  : userList?.content?.map((row) => (
                      <TableRow key={row.patientId}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.mobileNo}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => navigate(`/lab/patientProfile/${row.patientId}`)}
                            sx={{
                              color: '#04BA8E',
                              textDecoration: 'underline',
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                            size='small'
                          >
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component='div'
            count={userList?.page?.totalElements || 0}
            rowsPerPage={pagination.size}
            page={pagination.page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleSizeChange}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default LabDashboard;
