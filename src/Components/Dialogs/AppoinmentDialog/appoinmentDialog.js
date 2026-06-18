import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentSlotDetails from './AppointmentSlotDetails';

const AppoinmentDialog = ({ open, onClose, status, paymentSuccess, selectedDocter }) => {
  const { isUserLoggedIn, signUpLoading } = useSelector((state) => state.home);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [routName, setRouteName] = useState('details');
  const renderComponent = (routName) => {
    switch (routName) {
      case 'details':
        return (
          <AppointmentSlotDetails
            onClose={onClose}
            setRouteName={setRouteName}
            status={status}
            paymentSuccess={paymentSuccess}
            selectedDocter={selectedDocter}
          />
        );
      // case 'success':
      //   return <AppointmentSuccess onClose={onClose} setRouteName={setRouteName} status={status} />;

      default:
        return <></>;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        // maxWidth='md'
        // fullScreen={routName === 'register' ? true : false}
        sx={{
          '.MuiDialog-paper': {
            padding: '24px',
            borderRadius: '32px',
            maxWidth: '800px',
          },
        }}
      >
        {renderComponent(routName)}
      </Dialog>
    </>
  );
};

export default AppoinmentDialog;
