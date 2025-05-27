import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3592C4', // Darcula blue
      light: '#4DABF5',
      dark: '#2B6B9F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9876AA', // Darcula purple
      light: '#B294BB',
      dark: '#7B5F8A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#2B2B2B', // Darcula main background
      paper: '#3C3F41', // Darcula secondary background
    },
    text: {
      primary: '#A9B7C6', // Darcula default text
      secondary: '#787878', // Darcula secondary text
    },
    error: {
      main: '#FF5261', // Darcula red
    },
    warning: {
      main: '#FFC66D', // Darcula yellow
    },
    success: {
      main: '#99C794', // Darcula green
    },
    divider: '#323232',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
