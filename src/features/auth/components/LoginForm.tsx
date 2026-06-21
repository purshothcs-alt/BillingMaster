import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { FormCheckbox } from '@/shared/components/FormControls';
import { useAppDispatch } from '@/app/hooks';
import { credentialsSet } from '@/features/auth/authSlice';
import { toastSuccess } from '@/features/ui/toastSlice';
import { getErrorMessage } from '@/services/api/baseApi';
import { ROUTES } from '@/shared/constants/routes';
import { useLoginMutation } from '../api/authApi';
import { loginSchema, type LoginFormValues } from '../schemas';

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      const response = await login(values).unwrap();
      dispatch(credentialsSet(response));
      dispatch(toastSuccess(`Welcome back, ${response.user.name}!`));
      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? ROUTES.DASHBOARD;
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Sign in
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your credentials to access your BillingMaster workspace.
        </Typography>
      </Stack>

      <Stack spacing={2.5}>
        {formError && <Alert severity="error">{formError}</Alert>}

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Email address"
              type="email"
              fullWidth
              autoFocus
              autoComplete="email"
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              autoComplete="current-password"
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" size="small">
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <FormCheckbox name="remember" control={control} label="Remember me" />
          <Link component={RouterLink} to={ROUTES.FORGOT_PASSWORD} variant="body2" underline="hover">
            Forgot password?
          </Link>
        </Stack>

        <Button type="submit" variant="contained" size="large" loading={isLoading} fullWidth>
          Sign in
        </Button>
      </Stack>
    </Box>
  );
};
