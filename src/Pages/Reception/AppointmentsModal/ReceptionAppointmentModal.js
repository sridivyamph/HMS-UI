import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, TextField, Text } from '@mui/material';
import HmsButton from '../../../Components/Buttons/HmsButton'
// import AppointmentSlotDetails from './AppointmentSlotDetails';
import CloseIcon from '@mui/icons-material/Close';
// import AppointmentConfirmation from './AppointmentConfirmation';
import { useNavigate } from 'react-router-dom';
import ReceptionSlotDetails from './ReceptionSlotDetails';
import ReceptionAppointmentConfirmation from './ReceptionAppointmentConfirmation';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { getDoctorAvailableSlotsByDateThunk } from '../../../Redux/Modules/Patient/HomeThunk';
import { updateSelectedDoctorRec } from '../../../Redux/Modules/Reception/ReceptionSlice';
import { convertFieldResponseIntoMuiTextFieldProps } from '@mui/x-date-pickers/internals';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  fontFamily: "'Albert Sans', sans-serif",
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height: '85%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export default function ReceptionAppointmentModal(props) {

  const {onClose, onCloseSlot, setReturnMessage, userId,bookingMode,prevApptDetails} = props;
  const [value, setValue] = useState('+91');
  const [slotArray, setSlotArray] = useState([]);
  const [routName, setRouteName] = useState('AppointmentSlotDetails');
  const [todayDate, setTodayDate] = useState('');
  const [slotConfirmationDetails,setslotConfirmationDetails] = useState({})
  const selectedDoctorRec = useSelector((state) => state.reception?.selectedDoctorRec || {});
  const availableTimeSlot = useSelector((state) => state.home?.doctorAvailableTimeSlots || []);
  // const bookingConfirmation = useSelector((state) => state.home?.bookedDoctorDetails || []);
  
  // console.log(bookingConfirmation,"bookingConfirmation");
  
  const dispatch = useDispatch();
  const onButtonClick = () => {
    if (routName === 'AppointmentConfirmation'){
      onClose();
    }
    else if(routName === 'AppointmentConfirmation') {
        onCloseSlot()
    }
    else {
      setRouteName('AppointmentConfirmation');
    }
  };

  useEffect(() => {
    if (availableTimeSlot && availableTimeSlot?.length >0 ) {
      const trimmeredSlots = availableTimeSlot?.map(({ startTime, available }) => ({ startTime, available }));
      setSlotArray(trimmeredSlots);
    } else {
      setSlotArray([]);
    }
  }, [availableTimeSlot])
  useEffect(() => {
    const curDate = new Date();
    const formattedDate = dayjs(curDate).format('YYYY-MM-DD');
    let payload;
    if(bookingMode === 'normal'){
      payload = {
        doctorId : selectedDoctorRec?.doctorId,
        date: formattedDate,
      };
    }else if(bookingMode === 'modify'){
      payload = {
        doctorId:prevApptDetails.doctorId,
        date:formattedDate,
      }
    }
    setTodayDate(formattedDate);
    dispatch(getDoctorAvailableSlotsByDateThunk(payload));
    // dispatch(updateSelectedDoctorRec(formattedDate))
  }, []);
  const doctorDetails =
    Object.keys(selectedDoctorRec).length > 0
      ? selectedDoctorRec
      : prevApptDetails;
  const renderComponent = (action) => {
    switch (action) {
      case 'AppointmentSlotDetails':
        if (!slotArray && slotArray.length === 0) {
      
        onCloseSlot(); 
        setReturnMessage("No Slots are opened for this doctor");
        return (
          <Typography
            variant="body2"
            sx={{ color: '#999', fontStyle: 'italic', mt: 2 }}
          >
            No available time slots. Returning to doctor selection...
          </Typography>
        );
      }
        return  <ReceptionSlotDetails onClick={onButtonClick} name="" selectedDoctorRec={selectedDoctorRec} slotArray={slotArray} setTodayDate={setTodayDate} todayDate={todayDate} userId={userId} 
        setSlotConfirmationDetails={setslotConfirmationDetails} bookingMode={bookingMode} prevApptDetails={prevApptDetails} onCloseSlot={onCloseSlot} setRouteName={setRouteName} />;
      case 'AppointmentConfirmation':
        return <ReceptionAppointmentConfirmation onCloseSlot={onCloseSlot} name="" selectedDoctorRec={doctorDetails} 
        slotConfirmationDetails={slotConfirmationDetails} />;
      default:
        return <></>;
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <Modal open={props?.open} onClose={()=> props?.onCloseSlot}>

        <Box sx={style}>
          <Box position={'absolute'} marginLeft='85%' >
            {/* <Button variant='text' onClick={props?.onCloseSlot} >
            <CloseIcon fontSize="small" sx={{ mr: 1 }} />
            </Button> */}
          </Box>
          {renderComponent(routName)}
        </Box>
      </Modal>
    </div>
  );
}
