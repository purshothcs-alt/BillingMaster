import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PaletteMode } from '@mui/material';
import type { RootState } from '@/app/store';

const THEME_STORAGE_KEY = 'billingmaster.themeMode';

const getInitialMode = (): PaletteMode => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

interface Breadcrumb {
  label: string;
  path?: string;
}

interface UiState {
  themeMode: PaletteMode;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  breadcrumbs: Breadcrumb[];
  pageTitle: string;
}

const initialState: UiState = {
  themeMode: getInitialMode(),
  sidebarOpen: false,
  sidebarCollapsed: false,
  breadcrumbs: [],
  pageTitle: 'Dashboard',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_STORAGE_KEY, state.themeMode);
    },
    setThemeMode: (state, action: PayloadAction<PaletteMode>) => {
      state.themeMode = action.payload;
      localStorage.setItem(THEME_STORAGE_KEY, state.themeMode);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setBreadcrumbs: (state, action: PayloadAction<Breadcrumb[]>) => {
      state.breadcrumbs = action.payload;
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
  },
});

export const {
  toggleThemeMode,
  setThemeMode,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setBreadcrumbs,
  setPageTitle,
} = uiSlice.actions;

export const selectThemeMode = (state: RootState) => state.ui.themeMode;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state: RootState) => state.ui.sidebarCollapsed;
export const selectBreadcrumbs = (state: RootState) => state.ui.breadcrumbs;
export const selectPageTitle = (state: RootState) => state.ui.pageTitle;

export default uiSlice.reducer;
