import React from "react";
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
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Logo from "../../assets/Logo.svg";
import DoctorProfile from "../../Components/DoctorProfile/DoctorProfile";
import ReceptionAppointmentModal from "../../Pages/Reception/ReceptionAppointmentModal";
import { useDispatch, useSelector } from "react-redux";
import { saveNewPatientInfo } from "../../Redux/Modules/Reception/ReceptionThunk";
import { fetchDoctorListThunk } from "../../Redux/Modules/Patient/HomeThunk";
import { useParams } from "react-router-dom";
import {
  clearReceptionCache,
  updateSelectedDoctorRec,
} from "../../Redux/Modules/Reception/ReceptionSlice";
import {
  getPatientProfileById,
  getUserAppointment,
  cancelAppointment,
} from "../../Services/PatientServices";
import { updatePatientPrescription } from "../../Services/DoctorServices";
import { use } from "react";

const ViewPatientProfile = () => {
  const { id } = useParams();
  const [userData, setuserData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const userRole = localStorage.getItem("user_role");

  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [prescription, setPrescriptionText] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  useEffect(() => {
    getPatientProfileById(id).then((val) => {
      console.log(val.data, "Value");
      const userObject = val.data;
      console.log(userObject, "userObject");
      const userDetailsArray = [
        { label: "Name", value: userObject.name || "N/A" },
        { label: "Gender", value: userObject.gender || "N/A" },
        { label: "DOB", value: userObject.dateOfBirth || "N/A" },
        { label: "Occupation", value: userObject.occupation || "N/A" },
        { label: "Email", value: userObject.email || "N/A" },
        { label: "Phone", value: userObject.mobileNo || "N/A" },
      ];
      setuserData(userDetailsArray);
    });
  }, []);

  //declarations
  const [anchorEl, setAnchorEl] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [doctors, setDoctors] = useState("");
  const [openReceptionModal, setOpenReceptionModal] = useState(false);
  const { selectedDoctorRec } = useSelector((state) => state.reception);
  const doctorList = useSelector((state) => state.home.doctorList || []);
  const [searchDoctor, setSearchDoctor] = useState("");

  useEffect(() => {
    setDoctors(doctorList?.content);
  }, [doctorList]);

  const onCloseSlot = () => {
    setOpenReceptionModal(false);
    dispatch(clearReceptionCache());
  };

  const onBookAppointment = () => {
    setOpenModal(true);
    const doctorPayload = {
      data: {},
      param: 10,
    };
    console.log('triggered')
    dispatch(fetchDoctorListThunk(doctorPayload));
  };
  //appoiment modification both doc/recep
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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const payload = { param: id };
        const postsResponse = await getUserAppointment(payload);
        const appointments = postsResponse.data.content.map((item) => ({
          date: new Date(
            item.bookingDate + " " + item.timeFrom
          ).toLocaleString(),
          doctor: item.doctorName,
          specialty: item.categoryDetailName,
          qualifications: item.degree,
          location: "Hebrew Clinic, Beach Road, Besant Nagar, Chennai", // Hardcoded
          bookingId: item.rowId,
          ...item,
        }));
        setAppointments(appointments);
        console.log(appointments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = (appoinment) => {
    const payload = {
      doctorId: appoinment.doctorId,
      regNo: appoinment.regNo,
      patientId: appoinment.regNo,
      date: appoinment.bookingDate,
      time: appoinment.timeFrom,
      hospitalId: 3,
      status: "CANCELLED",
      bookingId: appoinment.bookingId,
    };

    cancelAppointment({ payload, param: appoinment.bookingId }).then((res) => {
      //
    });
  };
  const statusMap = {
    X: "CANCELLED",
    C: "CONFIRMED",
    B: "BOOKED",
    P: "PENDING",
  };
  const handleSavePrescription = async () => {
    if (!selectedAppointment) return;
    function formatAMPM(timeStr) {
      const [hours, minutes, seconds = "00"] = timeStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    const payload = {
      doctorId: selectedAppointment.doctorId,
      regNo: selectedAppointment.patientId,
      patientId: selectedAppointment.patientId,
      date: selectedAppointment.bookingDate,
      time: formatAMPM(selectedAppointment.timeFrom),
      hospitalId: 3,
      status: statusMap[selectedAppointment.bookingStatus] || "UNKNOWN",
      bookingId: selectedAppointment.bookingId,
      prescription: prescription,
    };
    console.log(payload);
    try {
      const response = await updatePatientPrescription({
        param: selectedAppointment.bookingId,
        payload: payload,
      });
      console.log(response);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }

    // Close and reset modal
    setPrescriptionModal(false);
    setPrescriptionText("");
    setSelectedAppointment(null);
  };

  const formatAppointmentDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      // timeStyle: "short",
    });
  };

  return (
    <>
      {/* Header */}
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "white", color: "black", boxShadow: "none" }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <img src={Logo} alt="Logo" height="40px" />
          </Typography>
          <Typography variant="h6" sx={{ marginRight: 5 }}>
            Lab Report
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <Button
            color="inherit"
            sx={{ marginLeft: 5 }}
            onClick={() => navigate("/receptionProfile")}
          >
            Receptionist
          </Button>
        </Toolbar>
      </AppBar>

      {/* Doctor Search */}
      {userRole === "RECEPTIONIST" && (
        <>
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
              <Typography variant="h6">Select a Doctor</Typography>
              <TextField
                label="Search Doctor"
                variant="outlined"
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
                      alignItems="center"
                      marginTop={1}
                    >
                      <DoctorProfile name={doctor?.fullName} />
                      <Button
                        variant="contained"
                        sx={{ height: 30, width: "25%", left: 40, bottom: 20 }}
                        onClick={() => {
                          setOpenModal(false);
                          setOpenReceptionModal(true);
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
          <Box>
            {openReceptionModal && (
              <ReceptionAppointmentModal
                open={openReceptionModal}
                onCloseSlot={onCloseSlot}
                userId={id}
              />
            )}
          </Box>
        </>
      )}
      <Box
        sx={{
          backgroundColor: "#F9F9F9",
          mb: 6,
        }}
      >
        <Container>
          <Box sx={{ display: "flex", pt: 6 }}>
            <Button
              onClick={() => {
                navigate(
                  userRole === "RECEPTIONIST"
                    ? "/receptionDashboard"
                    : "/doctor"
                );
              }}
            >
              <ArrowBackIosIcon
                sx={{
                  marginLeft: "4px",
                  color: "#2B2A29",
                  fontSize: 24,
                }}
              />{" "}
              <Typography
                sx={{ fontWeight: 600, color: "#2B2A29", fontSize: 24 }}
              >
                Patient Profile
              </Typography>
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={3}>
              <Card
                sx={{
                  borderRadius: "4px",
                  backgroundColor: "#04BA8E05",
                  border: "1px solid #04BA8E05",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar
                    src="https://via.placeholder.com/150"
                    alt="Don Crumb"
                    sx={{ width: 110, height: 110, mx: "auto", mb: 2 }}
                  />

                  {/* User Details */}
                  <Box sx={{ mt: 2, textAlign: "left" }}>
                    {userData.map((item, index) => (
                      <Box sx={{ pt: 2 }} key={item.Phone}>
                        <Typography
                          // key={index}//index is causing issues with the key prop of not  being unique
                          variant="body1"
                          sx={{
                            fontSize: 16,
                            fontWeight: 500,
                          }}
                          color="#6E6E6E"
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          // key={index}
                          variant="body1"
                          color="#2B2A29"
                          sx={{
                            fontSize: 16,
                            fontWeight: 500,
                            pt: 1,
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  {/* common */}
                  {/* Lab Reports Link */}
                  <Box
                    onClick={() => {
                      navigate("/labReports");
                    }}
                    sx={{
                      mt: 3,
                      display: "flex",
                      alignItems: "center",
                      color: "#04BA8E",
                      fontWeight: "bold",
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  >
                    Lab Reports
                    <ArrowForwardIosIcon
                      sx={{
                        marginLeft: "4px",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* common */}
            <Grid item xs={9}>
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  py: "40px",
                  px: "24px",
                  overflowX: "auto",
                }}
              >
                {/* not common extra in reception  */}
                {userRole === "RECEPTIONIST" && (
                  <>
                    <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                      <Grid
                        item
                        xs={6}
                        display="flex"
                        justifyContent="flex-start"
                      >
                        <Button
                          sx={{
                            backgroundColor: "#04BA8E",
                            color: "#ffffff",
                            minWidth: 180,
                            width: 300,
                            fontWeight: "bold",
                            "&:hover": { backgroundColor: "#039b78" },
                          }}
                          onClick={() => {
                            onBookAppointment();
                          }}
                        >
                          Book An Appointment
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        display="flex"
                        justifyContent="flex-end"
                      >
                        <Button
                          sx={{
                            backgroundColor: "#ffffff",
                            color: "#04BA8E",
                            minWidth: 180,
                            width: 300,
                            fontWeight: "bold",
                            border: "1.5px solid #04BA8E",
                            "&:hover": { backgroundColor: "#f2f2f2" },
                          }}
                          onClick={() => {
                            navigate("/labReports");
                          }}
                        >
                          See Lab Reports
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}

                {/* prescription modal */}
                <Modal
                  open={prescriptionModal}
                  onClose={() => {
                    setPrescriptionModal(false);
                    setPrescriptionText("");
                    setSelectedAppointment(null);
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "70%",
                      maxHeight: "120vh",
                      minHeight: "50vh",
                      bgcolor: "background.paper",
                      boxShadow: 24,
                      p: 4,
                      borderRadius: 3,
                      overflowY: "auto",
                    }}
                  >
                    <TextField
                      label="Prescription"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={8}
                      size="large"
                      sx={{ mb: 2 }}
                      value={prescription}
                      onChange={(e) => setPrescriptionText(e.target.value)}
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSavePrescription}
                      disabled={!prescription.trim()}
                    >
                      Save
                    </Button>
                  </Box>
                </Modal>
                {/* common l 254 */}
                {/* Visit Information in Accordion */}
                {/* {[
                  {
                    title: "Visit Information",
                    data: [
                      {
                        date: "21 Nov",
                        reason: "Cold",
                        prescription: "21doncrumb.pdf",
                      },
                      {
                        date: "19 Nov",
                        reason: "Fever",
                        prescription: "19doncrumb.pdf",
                      },
                      {
                        date: "17 Nov",
                        reason: "Fever",
                        prescription: "17doncrumb.pdf",
                      },
                    ],
                  }, */}
                {/* ].map((section, idx) => ( */}
                <Accordion
                  // key={idx}
                  sx={{
                    mb: 2,
                    backgroundColor: "#04BA8E0A",
                    borderRadius: 1,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#04BA8E" }} />}
                    sx={{
                      fontWeight: "bold",
                      color: "#444444",
                      fontSize: 16,
                    }}
                  >
                    Visit Information
                  </AccordionSummary>
                  <AccordionDetails>
                    {appointments.length > 0 ? (
                      <Grid
                        container
                        spacing={1}
                        backgroundColor="#fff"
                        sx={{ py: 2, px: 2 }}
                      >
                        {/* {section.title === "Visit Information" ? ( */}
                        <>
                          <Grid item xs={4} textAlign={"center"}>
                            <Typography variant="subtitle2">
                              Date of Visit
                            </Typography>
                          </Grid>
                          <Grid item xs={4} textAlign={"center"}>
                            <Typography variant="subtitle2">
                              Reason for Visit
                            </Typography>
                          </Grid>
                          <Grid item xs={4} textAlign={"center"}>
                            <Typography variant="subtitle2">
                              Prescription
                            </Typography>
                          </Grid>
                          {appointments.map((visit, index) => (
                            <React.Fragment key={index}>
                              <Grid item xs={4} textAlign={"center"}>
                                {formatAppointmentDate(visit.date)}
                              </Grid>
                              <Grid item xs={4} textAlign={"center"}>
                                {visit.reasonForVisit}
                              </Grid>
                              <Grid item xs={4} textAlign={"center"}>
                                <Link href="#" color="primary">
                                  {visit.prescription}
                                </Link>
                              </Grid>
                            </React.Fragment>
                          ))}
                        </>
                        {/* ) : ( */}
                        {/* <>
                            <Grid item xs={4} textAlign={"center"}>
                              <Typography variant="subtitle2">
                                Condition
                              </Typography>
                            </Grid>
                            <Grid item xs={4} textAlign={"center"}>
                              <Typography variant="subtitle2">Date</Typography>
                            </Grid>
                            <Grid item xs={4} textAlign={"center"}>
                              <Typography variant="subtitle2">
                                Treatment
                              </Typography>
                            </Grid>
                            {appointments.map((record, index) => (
                              <React.Fragment key={index}>
                                <Grid item xs={4} textAlign={"center"}>
                                  {record.reasonForVisit}
                                </Grid>
                                <Grid item xs={4} textAlign={"center"}>
                                  {record.date}
                                </Grid>
                                <Grid item xs={4} textAlign={"center"}>
                                  {record.treatment}
                                </Grid>
                              </React.Fragment>
                            ))}
                          </> */}
                        {/* )} */}
                      </Grid>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No records available.
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
                {/* ) */}
                {/* )} */}
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: "#04BA8E" }} />}
                      sx={{
                        fontWeight: "bold",
                        color: "#444444",
                        fontSize: 16,
                      }}
                    >
                      All Appointments
                    </AccordionSummary>
                    <AccordionDetails>
                      {appointments.length > 0 ? (
                        <Grid
                          container
                          spacing={1}
                          backgroundColor="#fff"
                          sx={{ py: 2, px: 2 }}
                        >
                          {/* Header Row */}
                          <Grid item xs={2} textAlign="center">
                            <Typography variant="subtitle2">
                              Date & Time
                            </Typography>
                          </Grid>
                          <Grid item xs={3} textAlign="center">
                            <Typography variant="subtitle2">Doctor</Typography>
                          </Grid>
                          <Grid item xs={3} textAlign="center">
                            <Typography variant="subtitle2">
                              Specialty
                            </Typography>
                          </Grid>
                          <Grid item xs={2} textAlign="center">
                            <Typography variant="subtitle2">
                              Location
                            </Typography>
                          </Grid>
                          <Grid item xs={1} textAlign="center">
                            <Typography variant="subtitle2">Status</Typography>
                          </Grid>
                          <Grid item xs={1} textAlign="center">
                            <Typography variant="subtitle2">Action</Typography>
                          </Grid>

                          {/* Appointment Rows */}
                          {appointments.map((appt, index) => (
                            <React.Fragment key={`appt-${index}`}>
                              <Grid item xs={2} textAlign="center">
                                {appt.date}
                              </Grid>
                              <Grid item xs={3} textAlign="center">
                                {appt.doctor}
                              </Grid>
                              <Grid item xs={3} textAlign="center">
                                {appt.specialty}
                              </Grid>
                              <Grid item xs={2} textAlign="center">
                                {appt.location}
                              </Grid>
                              <Grid item xs={1} textAlign="center">
                                {statusMap[appt.bookingStatus]}
                              </Grid>
                              <Grid item xs={1} textAlign="center">
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleClick(e, index)}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                                <Menu
                                  anchorEl={anchorEl[index]}
                                  open={Boolean(anchorEl[index])}
                                  onClose={() => handleClose(index)}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                >
                                  {userRole === "RECEPTIONIST" && (
                                    <>
                                      <MenuItem
                                        onClick={() => {
                                          // handleChangeppointment(appt);
                                        }}
                                        sx={{
                                          color: "#04BA8E",
                                          fontSize: "14px",
                                          fontWeight: 500,
                                          px: 2,
                                          py: 1,
                                          borderRadius: "6px",
                                          transition: "all 0.2s ease-in-out",
                                          "&:hover": {
                                            backgroundColor: "#FFECEC",
                                            color: "#D8000C",
                                          },
                                        }}
                                      >
                                        Modify
                                      </MenuItem>
                                      {appt.bookingStatus !== "X" && (
                                        <MenuItem
                                          onClick={() => {
                                            handleCancelAppointment(appt);
                                            handleClose(index);
                                          }}
                                          sx={{
                                            color: "#FF2424",
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            px: 2,
                                            py: 1,
                                            borderRadius: "6px",
                                            transition: "all 0.2s ease-in-out",
                                            "&:hover": {
                                              backgroundColor: "#FFECEC",
                                              color: "#D8000C",
                                            },
                                          }}
                                        >
                                          Cancel
                                        </MenuItem>
                                      )}
                                    </>
                                  )}
                                  {userRole ==="DOCTOR" &&(
                                      <MenuItem 
                                        onClick={() => {
                                          setSelectedAppointment(appt);
                                          setPrescriptionModal(true);
                                        }}
                                        sx={{
                                          color: "#04BA8E",
                                          fontSize: "14px",
                                          fontWeight: 500,
                                          px: 2,
                                          py: 1,
                                          borderRadius: "6px",
                                          transition: "all 0.2s ease-in-out",
                                          "&:hover": {
                                            backgroundColor: "#FFECEC",
                                            color: "#D8000C",
                                          },
                                        }}
                                      >
                                        Add Prescription
                                      </MenuItem>
                                    )}
                                </Menu>
                              </Grid>
                            </React.Fragment>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No upcoming appointments.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* <Footer /> */}
    </>
  );
};

export default ViewPatientProfile;
