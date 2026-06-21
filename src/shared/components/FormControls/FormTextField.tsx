import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { TextField, type TextFieldProps } from '@mui/material';

export interface FormTextFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  type?: TextFieldProps['type'];
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
}

export const FormTextField = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  multiline,
  rows,
  disabled,
  required,
  fullWidth = true,
  placeholder,
}: FormTextFieldProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          value={field.value ?? ''}
          label={label}
          type={type}
          multiline={multiline}
          rows={rows}
          disabled={disabled}
          required={required}
          fullWidth={fullWidth}
          placeholder={placeholder}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          onChange={(e) => {
            if (type === 'number') {
              field.onChange(e.target.value === '' ? '' : Number(e.target.value));
            } else {
              field.onChange(e.target.value);
            }
          }}
        />
      )}
    />
  );
};
