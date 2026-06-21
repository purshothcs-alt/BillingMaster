import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { EmptyState } from '@/shared/components/EmptyState/EmptyState';
import { useGetLowStockAlertsQuery } from '../api/dashboardApi';

export const LowStockAlerts = () => {
  const { data, isLoading } = useGetLowStockAlertsQuery();
  const alerts = data ?? [];

  return (
    <Card>
      <CardHeader
        title="Low Stock Alerts"
        subheader="Products at or below reorder level"
        avatar={<WarningAmberIcon color="warning" />}
      />
      <CardContent sx={{ maxHeight: 360, overflowY: 'auto' }}>
        {!isLoading && alerts.length === 0 && (
          <EmptyState title="All stocked up" description="No products are currently below reorder level." />
        )}
        <List disablePadding>
          {alerts.map((alert) => (
            <ListItem
              key={alert.id}
              disableGutters
              divider
              secondaryAction={
                <Chip
                  size="small"
                  color={alert.currentStock === 0 ? 'error' : 'warning'}
                  label={`${alert.currentStock} ${alert.unit} left`}
                />
              }
            >
              <ListItemText
                primary={alert.productName}
                secondary={
                  <Stack direction="row" spacing={1} component="span">
                    <Typography variant="caption" color="text.secondary" component="span">
                      SKU: {alert.sku}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" component="span">
                      Reorder at: {alert.reorderLevel}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
