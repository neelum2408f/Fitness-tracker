import { createTheme } from '@mui/material/styles';

// Dark, glossy fitness-app theme — inspired by dashboard/analytics reference.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF3D71', // magenta/pink — matches steps-ring accent
      contrastText: '#0B0E13',
    },
    secondary: {
      main: '#B6FF3C', // lime green — matches chart/CTA accent
      contrastText: '#0B0E13',
    },
    info: {
      main: '#31D9FF', // cyan — matches timer-ring accent
    },
    background: {
      default: '#0B0E13', // near-black app background
      paper: '#151A21',   // card surface
    },
    text: {
      primary: '#F4F6F8',
      secondary: '#8A93A3',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Archivo Black", "Arial Black", sans-serif' },
    h2: { fontFamily: '"Archivo Black", "Arial Black", sans-serif' },
    h3: { fontFamily: '"Archivo Black", "Arial Black", sans-serif' },
    h4: { fontFamily: '"Archivo Black", "Arial Black", sans-serif' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: '10px 22px' },
        containedPrimary: {
          boxShadow: '0 8px 20px rgba(255,61,113,0.35)',
          '&:hover': { boxShadow: '0 10px 26px rgba(255,61,113,0.45)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(255,255,255,0.06)',
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundImage: 'none' },
      },
    },
  },
});

export default theme;
