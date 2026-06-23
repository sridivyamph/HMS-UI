import React, { useState, useEffect } from 'react';
import { Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Fab
      onClick={scrollToTop}
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1000,
        backgroundColor: '#04BA8E',
        color: '#fff',
        width: 48,
        height: 48,
        display: visible ? 'flex' : 'none',
        '&:hover': { backgroundColor: '#039e7c' },
      }}
    >
      <KeyboardArrowUpIcon />
    </Fab>
  );
};

export default BackToTop;
