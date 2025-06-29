// Custom Material UI theme for a professional look
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a259ff', // Purple accent
    },
    secondary: {
      main: '#ffe066', // Yellow accent
    },
    background: {
      default: '#1a0033', // Purple-black
      paper: '#2d004d', // Deep purple for sheets
    },
    text: {
      primary: '#fff',
      secondary: '#ffe066', // Yellow for highlights
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: 16,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#2d004d',
          color: '#fff',
          boxShadow: '0 2px 8px rgba(60,72,88,0.07)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#2d004d',
          color: '#ffe066',
          fontWeight: 700,
        },
        body: {
          backgroundColor: '#2d004d',
          color: '#fff',
        },
      },
    },
  },
});

export default theme; 