import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Dialog,
  MenuItem,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import Doctor from "../../../assets/Doctor1.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { format, addDays, subDays, isToday } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarToday } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  bookAppointmentThunk,
  getDoctorAvailableSlotsByDateThunk,
} from '../../../Redux/Modules/Patient/HomeThunk';
import { createOrder, paymentConfirmation } from '../../../Services/PatientServices';
import { rescheduleAppointments } from '../../../Services/DoctorServices';
import { updateBackdrop } from '../../../Redux/Modules/Patient/HomeSlice';
import ErrorMessage from '../../ErrorMessage/errorMessage';

function AppointmentSlotDetails({
  onClose,
  isShowProfile = false,
  setRouteName,
  status,
  paymentSuccess,
  selectedDocter,
}) {
  const dispatch = useDispatch();
  const {
    doctorAvailableDates,
    doctorAvailableTimeSlots,
    selectedDoctor,
    bookedDoctorDetails,
  } = useSelector((state) => state.home);

  const { appointmentDates } = doctorAvailableDates;
  const { doctorId } = selectedDoctor;

  const today = dayjs().startOf("day"); // Today’s date without time
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekStart, setWeekStart] = useState(
    today.startOf("week").add(1, "day")
  ); // Monday start

  const [openCalendar, setOpenCalendar] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  // const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [razorPayKey, setrazorPayKey] = useState('');

  const convertTo12HourFormat = (time) => {
    let [hour, minute] = time.split(":");
    let period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${hour}:${minute} ${period}`;
  };

  const formatTimeSlots = (slots) => {
    return slots.reduce((acc, { date, startTime, available }) => {
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        time: convertTo12HourFormat(startTime),
        available,
      });
      return acc;
    }, {});
  };

  const timeSlotsData = formatTimeSlots(doctorAvailableTimeSlots);
  useEffect(() => {
    if (selectedDate && doctorAvailableTimeSlots) {
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
      const formattedDateString = String(formattedDate);
      // console.log(formattedDateString, 'formattedDateString');
      setAvailableSlots(timeSlotsData[formattedDateString] || []);
    }
  }, [selectedDate, doctorAvailableTimeSlots]);

  useEffect(() => {
    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
    const payload = {
      doctorId,
      date: formattedDate,
    };
    dispatch(getDoctorAvailableSlotsByDateThunk(payload));
  }, [selectedDate]);

  // Handle week navigation
  const changeWeek = (direction) => {
    setWeekStart((prev) => prev.add(direction, "week"));
  };

  // Generate the week’s dates dynamically
  const weekDates = Array.from({ length: 7 }, (_, index) =>
    weekStart.add(index, "day")
  );
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNext = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  const handlePrevious = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  const handlePayment = async (bookedDoctorDetails) => {
    const { appointmentId } = bookedDoctorDetails;
    const payload = {
      appointmentId: appointmentId,
    };
    createOrder(payload)
      .then((res) => {
        const { amount, currency, razorpayKey, orderId } = res.data;

        setrazorPayKey(razorpayKey);
        const onPaymentSuccess = (response) => {
          handlePaymentConfirmation(response, appointmentId, razorpayKey);
        };
        const handleExit = () => {
          onClose();
        };
        const options = {
          key: razorpayKey, // Replace with your Razorpay Key ID
          amount: amount,
          currency: currency,
          order_id: orderId,
          retry: {
            enabled: false, // 🔴 This disables the retry button
          },
          handler: onPaymentSuccess,

          theme: {
            color: '#3399cc',
          },
          modal: handleExit,
        };

        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', handlePaymentFailure);

        rzp1.open();
      })
      .catch((err) => {
        console.log(err, 'Error');
        setError(err.response.data.errorMessage || 'Something Went Wrong');
        setErrorOpen(true);
      });
  };
  const handlePaymentFailure = (response) => {
    const { error } = response;
    setErrorOpen(true);
    setError(error?.response?.data?.errorMessage || 'Your payment has been failed');
    setErrorOpen(true);
  };

  const handlePaymentConfirmation = (response, appointmentId, key) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      response;
    dispatch(updateBackdrop(true));
    // const { appointmentId } = bookedDoctorDetails;
    const payload = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointment_id: appointmentId,
      amount: "500.00",
      currency: "INR",
      method: "upi",
      key: key,
    };
    console.log("payLoad", payload);
    paymentConfirmation(payload).then((res) => {
      dispatch(updateBackdrop(false));
      console.log(res, "Repsoen");
      // setRouteName('success');
      paymentSuccess();
    });
  };
  const [reasonForVisit, setReasonForVisit] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError("Select a slot");
      return;
    }

    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
    const formatTime = (time) => {
      const [hourMinute, period] = time.split(" ");
      const [hour, minute] = hourMinute.split(":");
      const formattedHour = hour.padStart(2, "0"); // Ensures two-digit hour
      return `${formattedHour}:${minute} ${period}`;
    };

    const userId = localStorage.getItem("regNo");

    const payload = {
      doctorId: doctorId,
      regNo: userId,
      patientId: userId,
      date: formattedDate,
      time: formatTime(selectedSlot),
      hospitalId: 3,
      consMode: "I",
      paymentMethod: "ONLINE_PAYMENT",
      reasonForVisit: reasonForVisit,
    };

    if (status === "RESCHEDULE") {
      const bookingData = {
        doctorId: selectedDocter?.doctorId,
        newDate: formattedDate,
        newTime: formatTime(selectedSlot),
      };
      const parameter = selectedDocter.bookingId;
      rescheduleAppointments({
        param: selectedDocter.bookingId,
        payload: bookingData,
        param: parameter,
      }).then((res) => {
        paymentSuccess();
        console.log(res, "Response");
      });
      // rescheduleAppointments
    } else {
      // handlePayment(bookedDoctorDetails);

      try {
        // 🔹 Wait for dispatch to finish
        const bookingResult = await dispatch(
          bookAppointmentThunk(payload)
        ).unwrap();

        console.log("Booking success", bookingResult);

        // 🔹 Now call payment
        handlePayment(bookingResult); // or bookedDoctorDetails if that's what you want
      } catch (error) {
        setError(error?.response?.data?.errorMessage || 'Something went wrong');
        setErrorOpen(true);
        // Show error message to user
      }
    }
  };

  const handleDateChange = (newDate) => {
    if (!newDate) return; // Prevent errors if the date is null
    setSelectedDate(newDate); // Update selected date
    setWeekStart(newDate.startOf("week").add(1, "day")); // Update week start to that date's Monday
    setOpenCalendar(false); // Close calendar dialog
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const isSlotInPast = (slotTime) => {
    const now = dayjs();

    const selectedDay = dayjs(selectedDate);
    if (!selectedDay.isSame(now, "day")) return false; // Only check for today

    const [time, period] = slotTime.split(" ");
    let [hour, minute] = time.split(":").map(Number);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const slotDateTime = selectedDay.hour(hour).minute(minute);
    return slotDateTime.isBefore(now);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
    setError('');
  };
  return (
    <>
      <Box
        component={'form'}
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant='h6' sx={{ color: '#2B2A29' }}>
              Schedule Appointment
            </Typography>
            <CloseIcon onClick={onClose} sx={{ cursor: 'pointer', color: '#000' }} />
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex' }}>
              <Avatar
                src={selectedDoctor.image}
                alt={selectedDoctor.name}
                sx={{ width: 100, height: 100, mr: 2, borderRadius: '50%' }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant='h6'
                  sx={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#2B2A29',
                  }}
                >
                  {selectedDoctor.doctorName}
                </Typography>
                <Typography
                  variant='body2'
                  color='textSecondary'
                  sx={{
                    color: '#333333',
                    fontSize: 16,
                  }}
                >
                  {selectedDoctor.specialization}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <SchoolOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    sx={{
                      color: '#2B2A29',
                      fontSize: 12,
                    }}
                  >
                    {selectedDoctor.qualification}
                  </Typography>
                </Box>
                {/* <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <LocationOnIcon fontSize='small' sx={{ mr: 1 }} />
                <Typography
                  variant='body2'
                  color='textSecondary'
                  sx={{
                    color: '#2B2A29',
                    fontSize: 12,
                  }}
                >
                  {selectedDoctor.address},{selectedDoctor.cityName}
                </Typography>
              </Box> */}
              </Box>
            </Box>
            {isShowProfile && (
              <Box>
                <Button onClick={() => navigate('/patient/doctorDetails')}>
                  <Typography
                    sx={{
                      color: '#2B2A29',
                      textDecoration: 'underline',
                    }}
                    variant='h6'
                    fontSize={16}
                    fontWeight={500}
                  >
                    View Profile
                  </Typography>
                </Button>
              </Box>
            )}
          </Box>
          <Box marginTop={3}>
            {' '}
            <Box>
              {/* Date Navigation */}
              <Grid container spacing={1}>
                <Grid item size={1}>
                  <IconButton onClick={() => changeWeek(-1)} disabled={weekStart.isBefore(today)}>
                    <ChevronLeft />
                  </IconButton>
                </Grid>
                {weekDates.map((date) => {
                  const dateString = date.format('YYYY-MM-DD'); // Convert date to string format
                  const isAvailable = appointmentDates?.includes(dateString); // Check availability
                  return (
                    <Grid item key={date.format('YYYY-MM-DD')}>
                      <Button
                        sx={{
                          color: '#2B2A29',
                          // fontSize: '14px',
                          // padding: '4px',
                          backgroundColor: date.isSame(selectedDate) ? '#04BA8E0A' : '#fff',
                          border: date.isSame(selectedDate)
                            ? '1px solid #04BA8E'
                            : '1px solid #6E6E6E3D',
                          borderRadius: '8px',
                        }}
                        // variant={date.isSame(selectedDate) ? 'contained' : 'outlined'}
                        // color={date.isSame(today) ? '#04BA8E' : '#2B2A29'}
                        onClick={() => handleSelectDate(date)}
                        disabled={!isAvailable || date.isBefore(today)} // Disable if the date is not in the available list
                      >
                        {date.format('DD MMM')} <br /> {date.format('ddd')}
                      </Button>
                    </Grid>
                  );
                })}
                <Grid item size={1}>
                  <IconButton onClick={() => changeWeek(1)}>
                    <ChevronRight />
                  </IconButton>
                </Grid>
              </Grid>

              {/* See More Dates */}
              <Button
                startIcon={<CalendarToday />}
                fullWidth
                sx={{ mt: 2, border: '1px solid #6E6E6E3D', borderRadius: '8px', color: '#444444' }}
                variant='outlined'
                onClick={() => setOpenCalendar(true)}
              >
                See More Dates
              </Button>

              {/* Calendar Dialog */}
              <Dialog open={openCalendar} onClose={() => setOpenCalendar(false)}>
                <Box sx={{ p: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{}}
                      label='See More Dates'
                      value={selectedDate}
                      onChange={(newDate) => {
                        handleDateChange(newDate);
                      }}
                      disablePast
                    />
                  </LocalizationProvider>
                </Box>
              </Dialog>
              {/* Time Slots */}
              <Typography sx={{ mt: 3 }}>Select Slot</Typography>
              <ToggleButtonGroup exclusive sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {availableSlots.length > 0 ? (
                  availableSlots.map(({ time, available }) => {
                    const disabled = !available || isSlotInPast(time); // ⬅️ combine logic here
                    return (
                      <ToggleButton
                        onClick={() => {
                          setSelectedSlot(time);
                          setError('');
                        }}
                        disabled={disabled}
                        key={time}
                        value={time}
                        sx={{
                          border:
                            selectedSlot === time
                              ? '1px solid #04BA8E !important'
                              : '1px solid #6E6E6E3D !important',
                          borderRadius: '8px !important',
                          backgroundColor:
                            selectedSlot === time ? '#04BA8E0A !important' : 'transparent',
                          color: '#2B2A29',
                          opacity: disabled ? 0.5 : 1, // Optional: faded style for disabled
                          cursor: disabled ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {time}
                      </ToggleButton>
                    );
                  })
                ) : (
                  <Typography color='textSecondary' sx={{ mt: 2 }}>
                    No Slots Available
                  </Typography>
                )}
              </ToggleButtonGroup>

              {/* Dropdowns for Reason & Booking */}
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={6}>
                  <TextField fullWidth select label='Reason for Visit'>
                    <MenuItem value='Consultation'>Consultation</MenuItem>
                    <MenuItem value='Follow-up'>Fever</MenuItem>
                    <MenuItem value='Follow-up'> Blood pressure</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth select label='Booking for'>
                    <MenuItem value='Self'>Self</MenuItem>
                    <MenuItem value='Family'>Family</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              {error && <Typography sx={{ color: 'red', mx: 0.5 }}>{error}</Typography>}

              {/* Proceed Button */}
              <Button
                variant='contained'
                fullWidth
                type='submit'
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
              >
                {status === 'RESCHEDULE' ? 'Confirm Appointment' : ' Proceed to Pay Rs 500.00'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Box>
      <ErrorMessage
        message={error}
        open={errorOpen}
        onClose={handleErrorClose}
        variant='snackbar' // or "dialog"
      />
    </>
  );
}

export default AppointmentSlotDetails;
