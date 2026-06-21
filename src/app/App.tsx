import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { router } from './router';
import { AppThemeProvider } from '@/theme/AppThemeProvider';
import { ConfirmDialogProvider } from '@/shared/components/ConfirmDialog/ConfirmDialogProvider';
import { ToastContainer } from '@/shared/components/Toast/ToastContainer';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary/ErrorBoundary';

export const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppThemeProvider>
          <ConfirmDialogProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </ConfirmDialogProvider>
        </AppThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};
