import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getErrorMessage } from '@/services/api/baseApi';
import { ROUTES } from '@/shared/constants/routes';
import { useForgotPasswordMutation } from '../api/authApi';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas';

export const ForgotPasswordForm = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, getValues } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setFormError(null);
    try {
      await forgotPassword(values).unwrap();
      setSubmitted(true);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  if (submitted) {
    return (
      <Stack spacing={2.5}>
        <Typography variant="h5" fontWeight={700}>
          Check your inbox
        </Typography>
        <Alert severity="success">
          If an account exists for {getValues('email')}, we've sent password reset instructions to it.
        </Alert>
        <Link component={RouterLink} to={ROUTES.LOGIN} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ArrowBackIcon fontSize="small" /> Back to sign in
        </Link>
      </Stack>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Forgot password?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your account email and we'll send you a link to reset your password.
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
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Button type="submit" variant="contained" size="large" loading={isLoading} fullWidth>
          Send reset link
        </Button>

        <Link
          component={RouterLink}
          to={ROUTES.LOGIN}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}
        >
          <ArrowBackIcon fontSize="small" /> Back to sign in
        </Link>
      </Stack>
    </Box>
  );
};
