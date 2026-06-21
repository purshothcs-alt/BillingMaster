import type { Components, Theme } from '@mui/material/styles';

export const components: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        paddingInline: 16,
      },
    },
    defaultProps: {
      disableElevation: true,
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 12,
        border: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiTextField: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiSelect: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiTableCell: {
    styleOverrides: {
      head: ({ theme }) => ({
        fontWeight: 600,
        backgroundColor: theme.palette.mode === 'light' ? '#f4f6f8' : '#0f2336',
      }),
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
    },
    defaultProps: {
      elevation: 0,
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundImage: 'none',
      }),
    },
  },
};
