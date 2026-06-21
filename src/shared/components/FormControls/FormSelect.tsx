import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FormSelectProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

export const FormSelect = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  options,
  disabled,
  required,
  fullWidth = true,
}: FormSelectProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth={fullWidth} error={Boolean(fieldState.error)} required={required}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            {...field}
            value={field.value ?? ''}
            labelId={`${name}-label`}
            label={label}
            disabled={disabled}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};
