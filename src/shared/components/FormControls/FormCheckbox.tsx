import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Checkbox, FormControlLabel } from '@mui/material';

export interface FormCheckboxProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  disabled?: boolean;
}

export const FormCheckbox = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  disabled,
}: FormCheckboxProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Checkbox checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)} />
          }
          label={label}
          disabled={disabled}
        />
      )}
    />
  );
};
