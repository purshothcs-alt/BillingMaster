import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { FormControlLabel, Switch } from '@mui/material';

export interface FormSwitchProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  disabled?: boolean;
}

export const FormSwitch = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  disabled,
}: FormSwitchProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Switch checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)} />
          }
          label={label}
          disabled={disabled}
        />
      )}
    />
  );
};
