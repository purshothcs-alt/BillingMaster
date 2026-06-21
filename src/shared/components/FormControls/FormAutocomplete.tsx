import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import type { SelectOption } from './FormSelect';

export interface FormAutocompleteProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  options: SelectOption[];
  disabled?: boolean;
  loading?: boolean;
  onInputChange?: (value: string) => void;
}

export const FormAutocomplete = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  options,
  disabled,
  loading,
  onInputChange,
}: FormAutocompleteProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Autocomplete
          options={options}
          loading={loading}
          disabled={disabled}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          value={options.find((o) => o.value === field.value) ?? null}
          onChange={(_e, value) => field.onChange(value?.value ?? null)}
          onInputChange={(_e, value) => onInputChange?.(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            />
          )}
        />
      )}
    />
  );
};
