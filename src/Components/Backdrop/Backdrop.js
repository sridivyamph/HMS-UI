import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Spinner = ({ open, handleClose }) => {
  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 10000 })}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress color='inherit' />
    </Backdrop>
  );
};

export default Spinner;
