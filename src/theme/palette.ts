import type { PaletteOptions } from '@mui/material/styles';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#1976d2',
    light: '#4791db',
    dark: '#115293',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#ffffff',
  },
  success: { main: '#2e7d32' },
  warning: { main: '#ed6c02' },
  error: { main: '#d32f2f' },
  info: { main: '#0288d1' },
  background: {
    default: '#f4f6f8',
    paper: '#ffffff',
  },
  text: {
    primary: '#1a2027',
    secondary: '#5b6471',
  },
  divider: 'rgba(0, 0, 0, 0.08)',
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#64b5f6',
    light: '#90caf9',
    dark: '#42a5f5',
    contrastText: '#0a1929',
  },
  secondary: {
    main: '#ce93d8',
    light: '#e1bee7',
    dark: '#ba68c8',
    contrastText: '#0a1929',
  },
  success: { main: '#66bb6a' },
  warning: { main: '#ffa726' },
  error: { main: '#f44336' },
  info: { main: '#29b6f6' },
  background: {
    default: '#0a1929',
    paper: '#0f2336',
  },
  text: {
    primary: '#e3eaf2',
    secondary: '#9fb3c8',
  },
  divider: 'rgba(255, 255, 255, 0.08)',
};
