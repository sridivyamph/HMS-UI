import { useEffect, useState, useRef } from "react";
import VisitorCard from "../../../Components/VisitorCard/VisitorCard";
import Spinner from "../../../Components/Backdrop/Backdrop";
import {
  Typography,
  IconButton,
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
  Modal,
  Box,
  Popper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TablePagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { green } from "@mui/material/colors";
import DoctorProfile from "../../../Components/DoctorProfile/DoctorProfile";
import ReceptionAppointmentModal from "../AppointmentsModal/ReceptionAppointmentModal";
import HmsButton from "../../../Components/Buttons/HmsButton";
import { useNavigate } from "react-router-dom";
import { fetchDoctorListThunk } from "../../../Redux/Modules/Patient/HomeThunk";
import {
  fetchUpcommingAppointmentList,
  fetchPreviousAppointmentList,
  saveNewPatientInfo,
  sendOtp,
  shortUpdatePatientInfo,
  fetchPatientProfile,
  fetchVisitsAndConsults,
} from "../../../Redux/Modules/Reception/ReceptionThunk";
import { useDispatch, useSelector } from "react-redux";
import {
  clearReceptionCache,
  updateSelectedDoctorRec,
} from "../../../Redux/Modules/Reception/ReceptionSlice";
import ReceptionHeader from "../../../Components/Header/ReceptionHeader";
const ReceptionLanding = () => {
  const { appConfig } = useSelector((state) => state.auth);
  const hospitalId = appConfig?.hospitalId;
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [openReceptionModal, setOpenReceptionModal] = useState(false);
  const [bookingMode, setBookingMode] = useState('');
  const [doctors, setDoctors] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);

  const [hospitalVisits, setHospitalVisits] = useState(0);
  const [digitalConsults, setDigitalConsults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all_time");
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const action = await dispatch(fetchVisitsAndConsults(timeRange));
        if (fetchVisitsAndConsults.fulfilled.match(action)) {
          const { hospitalVisits, digitalConsults } = action.payload;
          setHospitalVisits(hospitalVisits);
          setDigitalConsults(digitalConsults);
        } else {
          console.error("Thunk rejected:", action.payload);
        }
      } catch (error) {
        console.error("Error dispatching thunk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, dispatch]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const isOtpRequired = useSelector((state) => state.reception?.isOtpRequired);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); 
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const isUserCreated = useSelector((state) => state.reception?.isUserCreated);
  const doctorList = useSelector((state) => state.home?.doctorList || []);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dob: "",
    sex: "",
    mobileNumber: "",
  });

  const handleFormSubmit = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    setDoctors(doctorList?.content);
  }, [doctorList]);

  //verfifying otp #verifyotp

  const [regNo, setRegNo] = useState("");
  const sendOtpClick = async () => {
    const otpString = otp.join("");
    const data = {
      mobileNumber: formData.mobileNumber,
      otp: otpString,
    };
    console.log(otp)
    try {
      setSpinnerLoad(true)
      if (otp?.length > 5) {
        const result = await dispatch(sendOtp(data)).unwrap();
        setRegNo(result?.regNo);
      } else {
        alert("Please enter 6 digit OTP");
      }
    } catch (error) {
      console.log("otp verification failed");
    }
    setSpinnerLoad(false)
  };
  const [searchDoctor, setSearchDoctor] = useState("");
  const [pagination, setPagination] = useState({ page: 0, size: 5 });
  const [openModal, setOpenModal] = useState(false);
  const [isSpinner, setSpinner] = useState(false);
  useEffect(() => {
    if (!openModal) return;

    const trimmedText = searchDoctor.trim();
    const doctorPayload = { pagination };

    const delayDebounce = setTimeout(() => {
      const fetchDoctors = async () => {
        setSpinner(true);

        try {
          if (trimmedText.length >= 3) {
            doctorPayload.data = { searchText: trimmedText };
          }
          await dispatch(fetchDoctorListThunk(doctorPayload)).unwrap();
        } catch (err) {
          console.error('Failed to fetch doctors:', err);
        } finally {
          setSpinner(false);
        }
      };

      fetchDoctors();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchDoctor, openModal, pagination, dispatch]);
  //in the add appointments creating the newusr & updating the profile using shortupdate limited data #shortupdate
  useEffect(() => {
    if (isUserCreated && regNo) {
      const shortUpdatePayload = {
        param: regNo,
        data: {
          patientId: regNo,
          name: formData.name,
          dateOfBirth: formData.dob,
          gender: formData.sex,
          mobileNo: formData.mobileNumber,
        },
      };
      dispatch(shortUpdatePatientInfo(shortUpdatePayload));
      setDetailsModal(false);
      setTimeout(() => {
        setOpenModal(true);
      }, 1000);
    }
  }, [isUserCreated, regNo]);

  const navigate = useNavigate();
  const [spinnerLoad, setSpinnerLoad] = useState(false);
  // Fetching the upcoming and previous appointment list based on the selected tab #tabselect
  useEffect(() => {
    const fetchAppointments = async () => {
      setSpinnerLoad(true)
      const params = `page=${page}&size=${rowsPerPage}`;
      const data = { type: selectedTab.toLowerCase() };
      console.log(data, selectedTab);
      try {
        let response;
        if (selectedTab === "upcoming") {
          response = await dispatch(
            fetchUpcommingAppointmentList({ param: params, data })
          ).unwrap();
        } else if (selectedTab === "previous") {
          response = await dispatch(
            fetchPreviousAppointmentList({ param: params, data })
          ).unwrap();
        } else if (selectedTab === "All") {
          response = await dispatch(
            fetchUpcommingAppointmentList({
              param: params,
              data: { consultationMode: "all" },
            })
          ).unwrap();
        }
        setAppointmentList(response.content);
        setAppointmentListCache(response.content);
        setTotalCount(response.page.totalElements);
        setSpinnerLoad(false);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setSpinnerLoad(false);
      }
    };

    fetchAppointments();
  }, [selectedTab, page, rowsPerPage, dispatch]);

  useEffect(() => {
    if (isOtpRequired) {
      setDetailsModal(false);
      setTimeout(() => {
        setOtpModal(true);
        setDetailsModal(true);
      }, 1500);
    }
  }, [isOtpRequired]);

  //onClick collecting form data, creating/updating the user intodb
  const clickSave = async () => {
    setSpinnerLoad(true)
    const errors = {};

    // Basic validation
    if (!formData.name) errors.name = "Name is required";
    if (!formData.dob) errors.dob = "Date of Birth is required";
    if (!formData.age) errors.age = "Age is required";
    if (!formData.sex) errors.sex = "Sex is required";
    if (!formData.mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
    } else if (formData.mobileNumber.length !== 10) {
      errors.mobileNumber = "Mobile number must be 10 digits";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    try {
      await dispatch(
        saveNewPatientInfo({ ...formData, hospitalId: hospitalId })
      ).unwrap();

      // if success, you can proceed to next modal
      setOtpModal(true);
    } catch (err) {
      console.error("Patient registration error:", err);

      // Server might return structured error
      const serverMessage = err?.response?.data?.message || err?.message || "";

      if (serverMessage.includes("Mobile Number already exists")) {
        setFormErrors({
          mobileNumber: "Mobile number already exists",
        });
      } else {
        // General 409 fallback
        setFormErrors({
          mobileNumber: "This mobile number is already registered.",
        });
      }
    }
    setSpinnerLoad(false)
  };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const [appointmentList, setAppointmentList] = useState([]);
  const [appointmentListCache, setAppointmentListCache] = useState([]);

  const [returnMessage, setReturnMessage] = useState("");

  const onCloseSlot = () => {
    setOpenReceptionModal(false);
    setOtpModal(false);
    setDetailsModal(false);
    dispatch(clearReceptionCache());
    setFormData({});
  };
  const [searchText, setSearchText] = useState("");
  const [serverResult, setServerResult] = useState(null); // for showing suggestion
  const inputRef = useRef(null);

  //search for patients from list of appoinements or hit the backend once  -#search
  const filterSearch = async (search, anchor = null) => {
    const trimmed = search.trim();
    setSearchText(trimmed);

    if (!trimmed) {
      setAppointmentList(appointmentListCache);
      setServerResult(null);
      return;
    }

    console.log(trimmed);
    const filteredData = appointmentListCache?.filter((data) => {
      const phoneMatch = data?.phoneNo?.includes(trimmed);
      const nameMatch = data?.patientName
        ?.toLowerCase()
        .includes(trimmed.toLowerCase());
      console.log(data, nameMatch);
      return phoneMatch || nameMatch;
    });

    if (filteredData?.length > 0) {
      setAppointmentList(filteredData);
      setServerResult(null);
      return;
    }

    try {
      if (search?.length < 7) return;
      const resultAction = await dispatch(
        fetchPatientProfile({ param: search })
      );

      if (fetchPatientProfile.fulfilled.match(resultAction)) {
        const patientData = resultAction.payload;
        setServerResult(patientData);
      } else {
        setServerResult(null);
      }
    } catch (err) {
      console.error("Thunk error:", err);
    }
  };

  return (
    <>
    <Spinner open={spinnerLoad} />
      <Box
        sx={{
          backgroundColor: "#F9F9F9",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ReceptionHeader />
        <Container maxWidth='xl'>
          {/* Overview Section */}
          <Grid container spacing={2} my={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 2, height: 200 }}>
                <Grid
                  container
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Typography
                    variant='h6'
                    sx={{
                      fontFamily: "Albert Sans",
                      fontWeight: 500,
                      fontSize: 18,
                      lineHeight: "28px",
                      letterSpacing: 0,
                    }}
                  >
                    Overview
                  </Typography>

                  <FormControl size='small' sx={{ minWidth: 120 }}>
                    <InputLabel id='time-range-label'>Time Range</InputLabel>
                    <Select
                      labelId='time-range-label'
                      value={timeRange}
                      label='Time Range'
                      onChange={handleTimeRangeChange}
                    >
                      <MenuItem value='all_time'>All Time</MenuItem>
                      <MenuItem value='today'>Today</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid container spacing={2} mt={1}>
                  <Grid item xs={6}>
                    <Paper
                      sx={{ display: "flex", alignItems: "center", padding: 2 }}
                    >
                      <LocalHospitalIcon
                        sx={{ color: green[500], marginRight: 1 }}
                        fontSize='large'
                      />
                      <div>
                        <Typography
                          variant='body1'
                          sx={{
                            fontFamily: "Albert Sans",
                            fontWeight: 500,
                            fontSize: 18,
                            lineHeight: "28px",
                            letterSpacing: 0,
                          }}
                        >
                          Patient Visits
                        </Typography>
                        <Typography
                          variant='h5'
                          sx={{
                            fontFamily: "Albert Sans",
                            fontWeight: 600,
                            fontSize: 28,
                            lineHeight: "28px",
                            letterSpacing: 0,
                          }}
                        >
                          {loading ? "..." : hospitalVisits}
                        </Typography>
                      </div>
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <Paper
                      sx={{ display: "flex", alignItems: "center", padding: 2 }}
                    >
                      <VideoCallIcon
                        sx={{ color: green[500], marginRight: 1 }}
                        fontSize='large'
                      />
                      <div>
                        <Typography
                          variant='body1'
                          sx={{
                            fontFamily: "Albert Sans",
                            fontWeight: 500,
                            fontSize: 18,
                            lineHeight: "28px",
                            letterSpacing: 0,
                          }}
                        >
                          Video Consultations
                        </Typography>
                        <Typography
                          variant='h5'
                          sx={{
                            fontFamily: "Albert Sans",
                            fontWeight: 600,
                            fontSize: 28,
                            lineHeight: "28px",
                            letterSpacing: 0,
                          }}
                        >
                          {"0"}
                          {/* {loading ? "..." : digitalConsults} */}
                        </Typography>
                      </div>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <VisitorCard />
          </Grid>

          {/* Doctor Search */}
          <Modal
            open={openModal}
            onClose={() => {
              setOpenModal(false);
              dispatch(saveNewPatientInfo({}));
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxHeight: "80%",
                overflow: "auto",
                width: 450,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 6,
                alignSelf: "center",
              }}
            >
              {" "}
              <IconButton
                onClick={() => {
                  setOpenModal(false);
                  dispatch(saveNewPatientInfo({}));
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "#04BA8E",
                }}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant='h6'>Select a Doctor</Typography>
              <TextField
                label='Search Doctor'
                variant='outlined'
                fullWidth
                sx={{ my: 2 }}
                value={searchDoctor}
                onChange={(e) => setSearchDoctor(e.target.value)}
              />
              {doctors &&
                doctors?.length > 0 &&
                doctors?.map((doctor) => (
                  <Typography key={doctor?.doctorId} sx={{ my: 1 }}>
                    <Grid
                      container
                      spacing={2}
                      alignItems='center'
                      marginTop={1}
                    >
                      <DoctorProfile name={doctor?.doctorName} />
                      <Button
                        variant='contained'
                        sx={{ height: 30, width: "25%", left: 40, bottom: 20 }}
                        onClick={() => {
                          setOpenModal(false);
                          setOpenReceptionModal(true);
                          setBookingMode('normal');
                          dispatch(updateSelectedDoctorRec(doctor));
                        }}
                      >
                        Book
                      </Button>
                    </Grid>
                  </Typography>
                ))}
            </Box>
          </Modal>

          {/* otp Validation */}
          {/* <Modal open={otpModal} onClose={() => setOtpModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 6 }}>
          <Typography variant="h6">Please Verify Otp</Typography>
          <TextField
            label="Enter the Otp"
            variant="outlined"
            fullWidth
            sx={{ my: 2 }}
            // value={otp}
            onChange={(e) => setOtp(e?.target?.value)}
          />
        </Box>
        <HmsButton onClick={() => sendOtp()}>Submit</HmsButton>
      </Modal> */}
      <Spinner open={isSpinner} />
          <Modal
            open={detailsModal}
            onClose={() => {
              setDetailsModal(false);
              setFormData({
                name: "",
                age: "",
                dob: "",
                sex: "",
                mobileNumber: "",
                reasonForVisit: "",
                bookingFor: "",
              });
              setFormErrors({});
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {!otpModal ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "90%", sm: "70%", md: "50%", lg: "40%" },
                    maxHeight: "90vh",
                    overflowY: "auto",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 3,
                    scrollbarWidth: "none",
                    fontFamily: "'Albert Sans', sans-serif", // Apply font family here globally inside modal
                  }}
                >
                  <IconButton
                    onClick={() => {
                      setDetailsModal(false);
                      setFormData({
                        name: "",
                        age: "",
                        dob: "",
                        sex: "",
                        mobileNumber: "",
                      });
                      setFormErrors({});
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <>
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 500,
                        fontSize: 18,
                        lineHeight: "28px",
                        letterSpacing: 0,
                        mb: 2,
                      }}
                    >
                      Enter Patient Details
                    </Typography>

                    <TextField
                      label='Name'
                      variant='outlined'
                      fullWidth
                      sx={{ my: 0.8, fontWeight: 500, fontSize: 16 }}
                      value={formData.name}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      onChange={(e) => handleFormSubmit("name", e.target.value)}
                      InputLabelProps={{
                        style: {
                          fontFamily: "'Albert Sans', sans-serif",
                          fontWeight: 500,
                        },
                        shrink: true,
                        required: true,
                      }}
                      inputProps={{
                        style: {
                          fontFamily: "'Albert Sans', sans-serif",
                          fontWeight: 500,
                          fontSize: 16,
                        },
                      }}
                    />

                    <DatePicker
                      label='Date of Birth'
                      value={formData.dob ? dayjs(formData.dob) : null}
                      onChange={(newValue) => {
                        if (!newValue || !dayjs(newValue).isValid()) {
                          setFormErrors((prev) => ({
                            ...prev,
                            dob: "Invalid date",
                          }));
                          return;
                        }

                        const dob = dayjs(newValue).format("YYYY-MM-DD");
                        const today = dayjs();
                        const age = today.diff(dayjs(dob), "year");

                        handleFormSubmit("dob", dob);
                        handleFormSubmit("age", age.toString());

                        setFormErrors((prev) => ({ ...prev, dob: "" }));
                      }}
                      format='DD/MM/YYYY'
                      disableMaskedInput={true}
                      minDate={dayjs("1900-01-01")}
                      maxDate={dayjs()}
                      slotProps={{
                        textField: {
                          variant: "outlined",
                          fullWidth: true,
                          sx: { my: 0.8, fontWeight: 500, fontSize: 16 },
                          error: !!formErrors.dob,
                          helperText: formErrors.dob,
                          InputLabelProps: {
                            style: {
                              fontFamily: "'Albert Sans', sans-serif",
                              fontWeight: 500,
                            },
                          },
                          inputProps: {
                            style: {
                              fontFamily: "'Albert Sans', sans-serif",
                              fontWeight: 500,
                              fontSize: 16,
                            },
                          },
                        },
                      }}
                    />

                    <TextField
                      label='Gender'
                      variant='outlined'
                      fullWidth
                      sx={{ my: 0.8, fontWeight: 500, fontSize: 16 }}
                      value={formData.sex}
                      error={!!formErrors.sex}
                      helperText={formErrors.sex}
                      onChange={(e) => handleFormSubmit("sex", e.target.value)}
                      InputLabelProps={{
                        style: {
                          fontFamily: "'Albert Sans', sans-serif",
                          fontWeight: 500,
                        },
                        shrink: true,
                        required: true,
                      }}
                      inputProps={{
                        style: {
                          fontFamily: "'Albert Sans', sans-serif",
                          fontWeight: 500,
                          fontSize: 16,
                        },
                      }}
                    />

                    <TextField
                      label='Mobile Number'
                      variant='outlined'
                      fullWidth
                      sx={{ my: 0.8, fontWeight: 500, fontSize: 16 }}
                      value={formData.mobileNumber}
                      error={!!formErrors.mobileNumber}
                      helperText={formErrors.mobileNumber}
                      onChange={(e) =>
                        handleFormSubmit("mobileNumber", e.target.value)
                      }
                      InputLabelProps={{
                        style: {
                          fontFamily: "'Albert Sans', sans-serif",
                          fontWeight: 500,
                        },
                        shrink: true,
                        required: true,
                      }}
                      inputProps={{
                        style: {
                          fontFamily: "'Albert Sans', sans-serif",
                          fontWeight: 500,
                          fontSize: 16,
                        },
                      }}
                    />
                    {/* <TextField
                      select
                      required
                      label='Reason For Visit'
                      variant='outlined'
                      fullWidth
                      sx={{ my: 0.8, fontWeight: 500, fontSize: 16 }}
                      value={formData.reasonForVisit}
                      error={!!formErrors.reasonForVisit}
                      helperText={formErrors.reasonForVisit}
                      onChange={(e) =>
                        handleFormSubmit("reasonForVisit", e.target.value)
                      }
                      InputLabelProps={{
                        style: {
                          fontFamily: "'Albert Sans', sans-serif",
                          fontWeight: 500,
                        },
                      }}
                      inputProps={{
                        style: {
                          fontFamily: "'Albert Sans', sans-serif",
                          fontWeight: 500,
                          fontSize: 16,
                        },
                      }}
                    >
                      <MenuItem value='consultation'>Consultation</MenuItem>
                      <MenuItem value='others'>Others</MenuItem>
                    </TextField> */}

                    {/* <TextField
                      select
                      required
                      label='Booking For'
                      variant='outlined'
                      fullWidth
                      sx={{ my: 0.8, fontWeight: 500, fontSize: 16 }}
                      value={formData.bookingFor}
                      error={!!formErrors.bookingFor}
                      helperText={formErrors.bookingFor}
                      onChange={(e) =>
                        handleFormSubmit("bookingFor", e.target.value)
                      }
                      InputLabelProps={{
                        style: {
                          fontFamily: "'Albert Sans', sans-serif",
                          fontWeight: 500,
                        },
                      }}
                      inputProps={{
                        style: {
                          fontFamily: "'Albert Sans', sans-serif",
                          fontWeight: 500,
                          fontSize: 16,
                        },
                      }}
                    >
                      <MenuItem value='self'>Self</MenuItem>
                      <MenuItem value='family'>Family</MenuItem>
                    </TextField> */}
                  </>
                  <Box sx={{ marginTop: 4 }}>
                    <HmsButton onClick={() => clickSave()}>Confirm</HmsButton>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "80%", sm: "60%", md: "40%" },
                    maxHeight: "90vh",
                    overflowY: "auto",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant='h6' gutterBottom>
                    Enter Your OTP
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    {otp.map((digit, index) => (
                      <TextField
                        key={index}
                        inputRef={(el) => (inputRefs.current[index] = el)}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        inputProps={{
                          maxLength: 1,
                          style: { textAlign: "center", fontSize: "1.5rem" },
                        }}
                        sx={{ width: 50 }}
                      />
                    ))}
                  </Box>

                  <HmsButton onClick={sendOtpClick}>Send</HmsButton>
                </Box>
              )}
            </LocalizationProvider>
          </Modal>

          <Box>
            {openReceptionModal && (
              <ReceptionAppointmentModal
                open={openReceptionModal}
                onCloseSlot={onCloseSlot}
                userId={regNo}
                setReturnMessage={setReturnMessage}
                bookingMode={bookingMode}
              />
            )}
          </Box>

          {/* Search & Button Section */}
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={9}>
              <TextField
                fullWidth
                label='Search'
                variant='outlined'
                placeholder='Enter complete mobile number'
                inputRef={inputRef}
                onChange={(e) => filterSearch(e.target.value)}
              />
              <Popper
                open={!!serverResult}
                anchorEl={inputRef.current}
                placement='bottom-start'
                style={{ zIndex: 999 }}
              >
                <Paper sx={{ padding: 1, minWidth: 300, boxShadow: 3 }}>
                  <TableContainer
                    component={Paper}
                    sx={{ minWidth: 300, maxHeight: 200, overflow: "auto" }}
                  >
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Phone</TableCell>
                          <TableCell>Details</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {serverResult?.content?.length > 0 ? (
                          serverResult.content.map((result) => (
                            <TableRow key={result.id}>
                              <TableCell>{result.name}</TableCell>
                              <TableCell>{result.mobileNo}</TableCell>
                              <TableCell>
                                <Button
                                  onClick={() =>
                                    navigate(
                                      `/receptionist/patientProfile/${result.patientId}`
                                    )
                                  }
                                  sx={{
                                    color: "#04BA8E",
                                    textDecoration: "underline",
                                    fontSize: 14,
                                    fontWeight: 500,
                                  }}
                                  size='small'
                                >
                                  View Patient Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <Typography variant='body2'>
                                No match found
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  setDetailsModal(true);
                                  handleFormSubmit("mobileNumber", searchText);
                                }}
                                sx={{
                                  fontFamily: "Albert Sans",
                                  fontWeight: 600,
                                  fontSize: 18,
                                  lineHeight: "28px",
                                  letterSpacing: 0,
                                }}
                              >
                                + Add Appointment
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Popper>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant='contained'
                sx={{
                  height: 55,
                  width: "100%",
                  color: "white",
                  backgroundColor: "#04BA8E",
                  fontFamily: "Albert Sans",
                  fontWeight: 600,
                  fontSize: 18,
                  lineHeight: "28px",
                  letterSpacing: 0,
                }}
                onClick={() => setDetailsModal(true)}
              >
                {" "}
                + Add Appointment
              </Button>
            </Grid>
          </Grid>

          {/* Tabs */}
          {/* <Grid container spacing={4} my={2} width="100%">
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={selectedTab === "upcoming" ? "contained" : "outlined"}
            onClick={() => handleTabChange("upcoming")}
            sx={{ height: 40, width: "50%", borderRadius: 10, fontSize: 12 }}
          >
            Upcoming Appointments
          </Button>
          <Button
            variant={selectedTab === "previous" ? "contained" : "outlined"}
            onClick={() => handleTabChange("previous")}
            sx={{
              height: 40,
              width: "50%",
              left: 10,
              borderRadius: 10,
              fontSize: 12,
            }}
          >
            Previous Appointments
          </Button>
            
        </Grid>
      </Grid> */}

          <Grid container spacing={4} my={2} width='100%'>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item>
                  <Button
                    variant='outlined'
                    onClick={() => handleTabChange("upcoming")}
                    sx={{
                      height: 40,
                      borderRadius: 10,
                      fontFamily: "Albert Sans",
                      fontWeight: 500,
                      fontSize: 18,
                      lineHeight: "140%",
                      letterSpacing: "-0.36px",
                      color: selectedTab === "upcoming" ? "" : "black",
                      borderColor:
                        selectedTab === "upcoming" ? "" : "rgba(0, 0, 0, 0.23)",
                      "&:hover": {
                        borderColor:
                          selectedTab === "upcoming" ? "green" : "black",
                        color: selectedTab === "upcoming" ? "green" : "black",
                      },
                    }}
                  >
                    Upcoming Appointments
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    variant='outlined'
                    onClick={() => handleTabChange("previous")}
                    sx={{
                      height: 40,
                      borderRadius: 10,
                      fontFamily: "Albert Sans",
                      fontWeight: 500,
                      fontSize: 18,
                      lineHeight: "140%",
                      letterSpacing: "-0.36px",
                      color: selectedTab === "previous" ? "" : "black",
                      borderColor:
                        selectedTab === "previous" ? "" : "rgba(0, 0, 0, 0.23)",
                      "&:hover": {
                        borderColor:
                          selectedTab === "previous" ? "green" : "black",
                        color: selectedTab === "previous" ? "green" : "black",
                      },
                    }}
                  >
                    Previous Appointments
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='outlined'
                    onClick={() => handleTabChange("All")}
                    sx={{
                      height: 40,
                      borderRadius: 10,
                      fontFamily: "Albert Sans",
                      fontWeight: 500,
                      fontSize: 18,
                      lineHeight: "140%",
                      letterSpacing: "-0.36px",
                      color: selectedTab === "All" ? "" : "black",
                      borderColor:
                        selectedTab === "All" ? "" : "rgba(0, 0, 0, 0.23)",
                      "&:hover": {
                        borderColor: selectedTab === "All" ? "" : "black",
                        color: selectedTab === "All" ? "" : "black",
                      },
                    }}
                  >
                    {" "}
                    All Appointments
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* Appointment Table */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <TableContainer component={Paper} sx={{ mt: 4, flexGrow: 1 }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#04BA8E0A" }}>
                  <TableRow>
                    {[
                      "Patient Name",
                      "Type",
                      "Phone No",
                      "Reason for Visit",
                      "Date",
                      "Appointment Time",
                      "Payment Status",
                      "Details",
                    ].map((text, index) => (
                      <TableCell
                        key={index}
                        sx={{
                          fontFamily: "Albert Sans",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: "22px",
                          letterSpacing: 0,
                        }}
                      >
                        {text}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {appointmentList?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        sx={{
                          fontFamily: "Albert Sans",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: "22px",
                          letterSpacing: 0,
                        }}
                      >
                        {row.patientName}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Albert Sans",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: "22px",
                          letterSpacing: 0,
                        }}
                      >
                        {row.consultationMode}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Albert Sans",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: "22px",
                          letterSpacing: 0,
                        }}
                      >
                        {row.phoneNo}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Albert Sans",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: "22px",
                          letterSpacing: 0,
                        }}
                      >
                        {row.reasonForVisit}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Albert Sans",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: "22px",
                          letterSpacing: 0,
                        }}
                      >
                        {row.date}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Albert Sans",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: "22px",
                          letterSpacing: 0,
                        }}
                      >
                        {row.appointmentTime}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Albert Sans",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: "22px",
                          letterSpacing: 0,
                        }}
                      >
                        {row.paymentStatus}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Albert Sans",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: "22px",
                          letterSpacing: 0,
                        }}
                      >
                        <Button
                          onClick={() =>
                            navigate(
                              `/receptionist/patientProfile/${row.patientId}`
                            )
                          }
                          sx={{
                            color: "#04BA8E",
                            textDecoration: "underline",
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                          size='small'
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReceptionLanding;
