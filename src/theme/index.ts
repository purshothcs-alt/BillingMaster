import { createTheme, responsiveFontSizes, type ThemeOptions } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';
import { lightPalette, darkPalette } from './palette';
import { typography } from './typography';
import { components } from './components';

const shape: ThemeOptions['shape'] = { borderRadius: 8 };

export const createAppTheme = (mode: PaletteMode) => {
  const theme = createTheme({
    palette: mode === 'light' ? lightPalette : darkPalette,
    typography,
    shape,
    components,
  });
  return responsiveFontSizes(theme);
};

export type { PaletteMode };
