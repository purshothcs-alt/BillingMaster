import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export interface FormDatePickerProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  disabled?: boolean;
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
}

export const FormDatePicker = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  disabled,
  minDate,
  maxDate,
}: FormDatePickerProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DatePicker
          label={label}
          value={field.value ? dayjs(field.value) : null}
          onChange={(value) => field.onChange(value ? value.toISOString() : null)}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: Boolean(fieldState.error),
              helperText: fieldState.error?.message,
            },
          }}
        />
      )}
    />
  );
};
