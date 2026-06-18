import { AppProvider } from './Context/appContext';
import { HashRouter } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Main from './Main';

const theme = createTheme({
  palette: {
    primary: {
      main: '#04BA8E',
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
  // typography: {
  //   fontFamily: '"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif', // Set Open Sans as default
  // },
  breakpoints: {
    values: {
      xs: 0, // Extra small devices (portrait phones)
      sm: 600, // Small devices (landscape phones)
      md: 960, // Medium devices (tablets)
      lg: 1280, // Large devices (desktops)
      xl: 1920, // Extra large devices (large desktops)
    },
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <Provider store={store}>
            <HashRouter>
              <Main />
            </HashRouter>
          </Provider>
        </AppProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
