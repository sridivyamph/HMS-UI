import {
  Avatar,
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Doctor from '../../../assets/Doctor1.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import { CalendarToday, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import HmsButton from '../../../Components/Buttons/HmsButton';
import {
  bookAppointmentThunk,
  getDoctorAvailableSlotsByDateThunk,
  rescheduleAppointmentThunk,
} from '../../../Redux/Modules/Patient/HomeThunk';

function ReceptionSlotDetails({
  isShowProfile = true,
  selectedDoctorRec,
  setTodayDate,
  userId,
  // reasonForVisit,
  setSlotConfirmationDetails,
  bookingMode,
  prevApptDetails,
  onCloseSlot,
  setRouteName,
}) {
  const dispatch = useDispatch();
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [bookingFor, setBookingFor] = useState('');
  const { doctorAvailableDates, doctorAvailableTimeSlots } = useSelector(
    (state) => state.home
  );
  const appConfig = useSelector((state) => state.auth);
  const hospitalId = appConfig?.hospitalId;

  const { appointmentDates } = doctorAvailableDates || {};
  const doctorId =
    bookingMode === 'normal'
      ? selectedDoctorRec?.doctorId
      : prevApptDetails?.doctorId;

  const today = dayjs().startOf('day');
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekStart, setWeekStart] = useState(
    today.startOf('week').add(1, 'day')
  );

  const [openCalendar, setOpenCalendar] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState('');

  const convertTo12HourFormat = (time) => {
    if (!time) return '';
    let [hour, minute] = time.split(':');
    let period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${period}`;
  };

  const formatTimeSlots = (slots) => {
    if (!slots || !Array.isArray(slots)) return {};
    return slots.reduce((acc, { date, startTime, available }) => {
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        time: convertTo12HourFormat(startTime),
        originalTime: startTime,
        available,
      });
      return acc;
    }, {});
  };

  const timeSlotsData = formatTimeSlots(doctorAvailableTimeSlots);

  useEffect(() => {
    if (selectedDate && doctorAvailableTimeSlots) {
      const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
      setAvailableSlots(timeSlotsData[formattedDate] || []);
    }
  }, [selectedDate, doctorAvailableTimeSlots]);

  useEffect(() => {
    if (doctorId) {
      const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
      const payload = {
        doctorId,
        date: formattedDate,
      };
      dispatch(getDoctorAvailableSlotsByDateThunk(payload));
      if (setTodayDate) {
        setTodayDate(formattedDate);
      }
    }
  }, [selectedDate, doctorId, dispatch, setTodayDate]);

  const changeWeek = (direction) => {
    setWeekStart((prev) => prev.add(direction, 'week'));
  };

  const weekDates = Array.from({ length: 7 }, (_, index) =>
    weekStart.add(index, 'day')
  );

  const confirmBooking = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot before confirming the booking.');
      return;
    }
    setError('');

    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');

    if (bookingMode === 'normal') {
      const bookingData = {
        doctorId: selectedDoctorRec?.doctorId,
        regNo: hospitalId?.regNo || userId,
        patientId: hospitalId?.regNo || userId,
        date: formattedDate,
        time: selectedSlot.originalTime,
        hospitalId: selectedDoctorRec?.hospId,
        consMode: 'I',
        reasonForVisit: reasonForVisit || ' ',
        paymentMethod: 'PAY_AT_HOSPITAL',
        updatedBy: 'Receptionist',
      };
      const bookedDoctorDetails = await dispatch(
        bookAppointmentThunk(bookingData)
      ).unwrap();
      const confiamtaionData = {
        date: formattedDate,
        time: selectedSlot.originalTime,
        bookingId: bookedDoctorDetails.appointmentId,
      };

      setSlotConfirmationDetails(confiamtaionData);
      setRouteName('AppointmentConfirmation');
    } else if (bookingMode === 'modify') {
      const bookingData = {
        doctorId: prevApptDetails?.doctorId,
        newDate: formattedDate,
        newTime: selectedSlot.originalTime,
      };
      const parameter = prevApptDetails.appointmentId;
      try {
        await dispatch(
          rescheduleAppointmentThunk({
            payload: bookingData,
            param: parameter,
          })
        ).unwrap();
        setSlotConfirmationDetails(bookingData);
        setRouteName('AppointmentConfirmation');
      } catch (err) {
        console.error('Reschedule failed:', err);
      }
    }
  };

  const handleDateChange = (newDate) => {
    if (!newDate) return;
    setSelectedDate(newDate);
    setWeekStart(newDate.startOf('week').add(1, 'day'));
    setOpenCalendar(false);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const isSlotInPast = (slot) => {
    const now = dayjs();
    const selectedDay = dayjs(selectedDate);
    if (!selectedDay.isSame(now, 'day')) return false;

    const [hour, minute] = slot.originalTime.split(':').map(Number);
    const slotDateTime = selectedDay.hour(hour).minute(minute);
    return slotDateTime.isBefore(now);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4, overflowY: 'auto' },
        height: '100%',
        scrollbarWidth: 'none',
        position: 'relative',
      }}
    >
      <IconButton
        onClick={onCloseSlot}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          color: '#04BA8E',
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography
        variant='h6'
        color='#333'
        fontSize={{ xs: 20, sm: 22, md: 24 }}
        fontWeight={600}
      >
        Schedule Appointment
      </Typography>

      <Grid container spacing={2} mt={1}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={Doctor} sx={{ width: 80, height: 80, mr: 2 }} />
            <Box>
              <Typography
                variant='h6'
                fontSize={{
                  xs: 16,
                  sm: 18,
                  fontFamily: "'Albert Sans', sans-serif",
                }}
              >
                {selectedDoctorRec?.doctorName}
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  color: '#333',
                  fontSize: 14,
                  fontFamily: "'Albert Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                {selectedDoctorRec?.qualification}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <SchoolOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
                <Typography
                  variant='body2'
                  sx={{
                    color: '#2B2A29',
                    fontSize: 12,
                    fontFamily: "'Albert Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {selectedDoctorRec?.qualification}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <LocationOnIcon fontSize='small' sx={{ mr: 1 }} />
                <Typography
                  variant='body2'
                  sx={{
                    color: '#2B2A29',
                    fontSize: 12,
                    fontFamily: "'Albert Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Hebrew Clinic, Besant Nagar.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box marginTop={3}>
        <Grid container spacing={1} alignItems='center'>
          <Grid item>
            <IconButton
              onClick={() => changeWeek(-1)}
              disabled={weekStart.isBefore(today)}
            >
              <ChevronLeft />
            </IconButton>
          </Grid>
          {weekDates.map((date) => {
            const dateString = date.format('YYYY-MM-DD');
            const isAvailable = appointmentDates?.includes(dateString);
            return (
              <Grid item key={date.format('YYYY-MM-DD')}>
                <Button
                  sx={{
                    color: '#2B2A29',
                    backgroundColor: date.isSame(selectedDate, 'day')
                      ? '#04BA8E0A'
                      : '#fff',
                    border: date.isSame(selectedDate, 'day')
                      ? '1px solid #04BA8E'
                      : '1px solid #6E6E6E3D',
                    borderRadius: '8px',
                    flexDirection: 'column',
                    p: 1,
                    minWidth: '60px',
                  }}
                  onClick={() => handleSelectDate(date)}
                  disabled={date.isBefore(today, 'day') || date.day() === 0}
                >
                  <Typography variant='body2'>
                    {date.format('DD MMM')}
                  </Typography>
                  <Typography variant='caption'>
                    {date.format('ddd')}
                  </Typography>
                </Button>
              </Grid>
            );
          })}
          <Grid item>
            <IconButton onClick={() => changeWeek(1)}>
              <ChevronRight />
            </IconButton>
          </Grid>
        </Grid>

        <Button
          startIcon={<CalendarToday />}
          fullWidth
          sx={{
            mt: 2,
            border: '1px solid #6E6E6E3D',
            borderRadius: '8px',
            color: '#444444',
          }}
          variant='outlined'
          onClick={() => setOpenCalendar(true)}
        >
          See More Dates
        </Button>

        <Dialog open={openCalendar} onClose={() => setOpenCalendar(false)}>
          <Box sx={{ p: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='See More Dates'
                value={selectedDate}
                onChange={handleDateChange}
                disablePast
              />
            </LocalizationProvider>
          </Box>
        </Dialog>

        <Typography sx={{ mt: 3, mb: 1, fontSize: 16, fontWeight: 500 }}>
          Select Slot
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={selectedSlot?.time}
          sx={{ flexWrap: 'wrap', gap: 1 }}
        >
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => {
              const disabled = !slot.available || isSlotInPast(slot);
              return (
                <ToggleButton
                  onClick={() => {
                    setSelectedSlot(slot);
                    setError('');
                  }}
                  disabled={disabled}
                  key={slot.time}
                  value={slot.time}
                  selected={selectedSlot?.time === slot.time}
                  sx={{
                    border: '1px solid #6E6E6E3D !important',
                    borderRadius: '8px !important',
                    backgroundColor:
                      selectedSlot?.time === slot.time
                        ? '#04BA8E0A !important'
                        : 'transparent',
                    color: '#2B2A29',
                    opacity: disabled ? 0.5 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    '&.Mui-selected': {
                      borderColor: '#04BA8E !important',
                    },
                  }}
                >
                  {slot.time}
                </ToggleButton>
              );
            })
          ) : (
            <Typography color='textSecondary' sx={{ mt: 2 }}>
              No Slots Available
            </Typography>
          )}
        </ToggleButtonGroup>
        {error && <Typography sx={{ color: 'red', mt: 1 }}>{error}</Typography>}

        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label='Reason for Visit'
              value={reasonForVisit || ''}
              onChange={(e) =>
                setReasonForVisit && setReasonForVisit(e.target.value)
              }
            >
              <MenuItem value='Consultation'>Consultation</MenuItem>
              <MenuItem value='Fever'>Fever</MenuItem>
              <MenuItem value='Blood pressure'>Blood pressure</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label='Booking for'
              value={bookingFor}
              onChange={(e) => setBookingFor(e.target.value)}
            >
              <MenuItem value='Self'>Self</MenuItem>
              <MenuItem value='Family'>Family</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Grid container flexDirection={'column'} alignItems={'end'}>
          <Button
            sx={{ fontFamily: "'Albert Sans', sans-serif", fontWeight: 500 }}
          >
            Payment Option : CASH (Default)
          </Button>
        </Grid>

        <Box mt={3}>
          <HmsButton
            onClick={confirmBooking}
            sx={{
              width: '100%',
              maxWidth: 300,
              display: 'block',
              mx: 'auto',
            }}
          >
            Proceed to Confirm
          </HmsButton>
        </Box>
      </Box>
    </Box>
  );
}

export default ReceptionSlotDetails;
