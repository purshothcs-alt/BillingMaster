import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import {
  getNotificationPermission,
  isPushSupported,
  subscribeToPushNotifications,
} from '@/services/pwa/pushNotifications';
import { PageHeader } from '@/shared/components/PageHeader/PageHeader';
import { FormSelect, FormTextField, FormSwitch } from '@/shared/components/FormControls';
import { Loader } from '@/shared/components/Loader/Loader';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectThemeMode, toggleThemeMode } from '@/features/ui/uiSlice';
import { toastError, toastSuccess } from '@/features/ui/toastSlice';
import { getErrorMessage } from '@/services/api/baseApi';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/features/settings/api/settingsApi';
import { businessSettingsSchema, type BusinessSettingsFormSchema } from '@/features/settings/schemas';
import { BUSINESS_TYPES } from '@/features/settings/types';

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const { data, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

  const { control, handleSubmit, reset } = useForm<BusinessSettingsFormSchema>({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: {
      businessName: '',
      businessType: 'Retail',
      email: '',
      phone: '',
      address: '',
      gstNumber: '',
      currency: 'INR',
      invoicePrefix: 'INV-',
      lowStockThreshold: 10,
      enableTax: true,
    },
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const onSubmit = async (values: BusinessSettingsFormSchema) => {
    try {
      await updateSettings(values).unwrap();
      dispatch(toastSuccess('Settings saved successfully.'));
    } catch (error) {
      dispatch(toastError(getErrorMessage(error)));
    }
  };

  if (isLoading) return <Loader fullScreen label="Loading settings..." />;

  return (
    <>
      <PageHeader title="Settings" subtitle="Configure your business profile and preferences" />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card component="form" onSubmit={handleSubmit(onSubmit)}>
            <CardHeader title="Business Profile" subheader="Used on invoices and receipts" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField name="businessName" control={control} label="Business Name" required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormSelect
                    name="businessType"
                    control={control}
                    label="Business Type"
                    options={BUSINESS_TYPES.map((t) => ({ value: t, label: t }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField name="email" control={control} label="Email" required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField name="phone" control={control} label="Phone" required />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormTextField name="address" control={control} label="Address" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField name="gstNumber" control={control} label="GST Number" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField name="currency" control={control} label="Currency Code" required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField name="invoicePrefix" control={control} label="Invoice Prefix" required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField
                    name="lowStockThreshold"
                    control={control}
                    label="Default Low Stock Threshold"
                    type="number"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormSwitch name="enableTax" control={control} label="Enable tax calculation on invoices" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button type="submit" variant="contained" loading={isSaving}>
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title="Appearance" subheader="Personalize how BillingMaster looks" />
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Brightness4Icon color="action" />
                  <Typography variant="body2">Dark mode</Typography>
                </Stack>
                <Switch checked={themeMode === 'dark'} onChange={() => dispatch(toggleThemeMode())} />
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2.5 }}>
            <CardHeader title="Push Notifications" subheader="Low stock and order alerts" />
            <CardContent>
              <NotificationsCardContent />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

const NotificationsCardContent = () => {
  const dispatch = useAppDispatch();
  const [permission, setPermission] = useState(getNotificationPermission());
  const [isSubscribing, setIsSubscribing] = useState(false);

  if (!isPushSupported()) {
    return <Alert severity="info">Push notifications aren't supported in this browser.</Alert>;
  }

  const handleEnable = async () => {
    setIsSubscribing(true);
    try {
      const subscription = await subscribeToPushNotifications(import.meta.env.VITE_VAPID_PUBLIC_KEY);
      if (subscription) {
        dispatch(toastSuccess('Push notifications enabled.'));
        setPermission('granted');
      } else {
        dispatch(toastError('Push notifications permission was not granted.'));
        setPermission(getNotificationPermission());
      }
    } catch (error) {
      dispatch(toastError(getErrorMessage(error)));
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" spacing={1.5} alignItems="center">
        <NotificationsActiveOutlinedIcon color="action" />
        <Typography variant="body2">
          {permission === 'granted' ? 'Notifications enabled' : 'Get notified about low stock and orders'}
        </Typography>
      </Stack>
      <Button variant="outlined" size="small" loading={isSubscribing} disabled={permission === 'granted'} onClick={handleEnable}>
        {permission === 'granted' ? 'Enabled' : 'Enable'}
      </Button>
    </Stack>
  );
};

export default SettingsPage;
