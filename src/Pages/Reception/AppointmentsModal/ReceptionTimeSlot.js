import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { isToday } from 'date-fns';
export default function ReceptionTimeSlot({ setSelectedDate, slotArray, selectedTimeSlot, todayDate }) {
  const now = new Date();
  const isSlotInPast = (startTime) => {
    if (!isToday(new Date(todayDate))) return false;

    const [hours, minutes] = startTime.split(':');
    const slotDate = new Date();
    slotDate.setHours(+hours, +minutes, 0, 0);

    return slotDate < now;
  };



  return (
    <Box
      sx={{
        overflowX: 'auto',
        display: 'flex',
        gap: 1,
        p: 1,
        width: '100%',
        flexWrap: 'wrap',
      }}
    >
      {slotArray?.length > 0 ? (
        slotArray.map((slot, index) => {
          const isSelected = slot?.startTime === selectedTimeSlot;
          const isAvailable = slot?.available === true;
          const isPast = isSlotInPast(slot?.startTime);

          const isDisabled = !isAvailable || isPast;

          return (
            <Button
              key={index}
              color="inherit"
              onClick={() => !isDisabled && setSelectedDate(slot?.startTime)}
              disabled={isDisabled}
              sx={{ p: 0, minWidth: 'unset' }}
            >
              <Box
                sx={{
                  minWidth: 60,
                  padding: 1,
                  textAlign: 'center',
                  border: '1px solid #04BA8E',
                  borderRadius: 1,
                  backgroundColor: isSelected
                    ? '#04BA8E'
                    : isDisabled
                    ? '#ccc'
                    : '#fff',
                  color: isSelected ? 'white' : 'black',
                  opacity: isDisabled ? 0.6 : 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "'Albert Sans', sans-serif", fontWeight: 500 }}
                >
                  {slot?.startTime}
                </Typography>
              </Box>
            </Button>
          );
        })
      ) : (
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#888' }}>
          No time slots available.
        </Typography>
      )}
    </Box>
  );
}
