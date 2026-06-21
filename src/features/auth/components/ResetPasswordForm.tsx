import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { getErrorMessage } from '@/services/api/baseApi';
import { ROUTES } from '@/shared/constants/routes';
import { useResetPasswordMutation } from '../api/authApi';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas';

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setFormError(null);
    try {
      await resetPassword({ token, password: values.password }).unwrap();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Reset password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose a new password for your account.
        </Typography>
      </Stack>

      <Stack spacing={2.5}>
        {!token && <Alert severity="warning">This reset link is missing or invalid.</Alert>}
        {formError && <Alert severity="error">{formError}</Alert>}

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="New password"
              type="password"
              fullWidth
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Confirm new password"
              type="password"
              fullWidth
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Button type="submit" variant="contained" size="large" loading={isLoading} disabled={!token} fullWidth>
          Reset password
        </Button>
      </Stack>
    </Box>
  );
};
