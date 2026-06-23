import React from 'react';
import Dialog from '@mui/material/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import SignupComponent from './singnUpComponent';
import RegisterComponent from './RegisterComponent';
import OTPVerifyComponent from './OTPVerifyComponent';
import Spinner from '../../Backdrop/Backdrop';
import LoginComponent from './LoginComponent';

const SignUpLoginDialog = ({ open, onClose }) => {
  const { isUserLoggedIn, loginSignUpAction, signUpLoading } = useSelector((state) => state.home);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const renderComponent = (loginSignUpAction) => {
    switch (loginSignUpAction) {
      case 'signup':
        return (
          <SignupComponent
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onClose={handleonClose}
          />
        );
      case 'signupotp':
      case 'loginotp':
        return (
          <OTPVerifyComponent
            phoneNumber={phoneNumber}
            onClose={handleonClose}
            loginSignUpAction={loginSignUpAction}
          />
        );
      case 'register':
        return <RegisterComponent onClose={handleonClose} phoneNumber={phoneNumber} />;

      case 'login':
      case 'book':
        return (
          <LoginComponent
            title={loginSignUpAction === 'login' ? 'Login' : 'Login to book an appointment'}
            onClose={handleonClose}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        );
      default:
        return <></>;
    }
  };

  const handleonClose = () => {
    onClose();
    setPhoneNumber('');
  };
  return (
    <>
      <Spinner open={signUpLoading} />
      <Dialog
        open={open}
        onClose={handleonClose}
        maxWidth='xs'
        fullScreen={loginSignUpAction === 'register' ? true : false}
        sx={{
          '.MuiDialog-paper': {
            padding: loginSignUpAction === 'register' ? '0' : '24px',
            borderRadius: loginSignUpAction === 'register' ? '0' : '32px',
          },
        }}
      >
        {renderComponent(loginSignUpAction)}
      </Dialog>
    </>
  );
};

export default SignUpLoginDialog;
