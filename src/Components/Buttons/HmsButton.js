import React from 'react';
import { Button } from '@mui/material';

const CustomButton = (props) => {
  return (
    <Button
      onClick={() => props?.onClick()}
      disabled={false}
      variant={'contained'}
      sx={{
        backgroundColor: '#04BA8E',
        color: 'white',
        '&:hover': {
          backgroundColor: '#039F76',
        },
        textTransform: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        height: '48px',
        width:'100%'
      }}
    >
      {props?.children}
    </Button>
  );
};

export default CustomButton;