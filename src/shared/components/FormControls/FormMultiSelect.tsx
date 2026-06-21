import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import type { SelectOption } from './FormSelect';

export interface FormMultiSelectProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  options: SelectOption[];
}

export const FormMultiSelect = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  options,
}: FormMultiSelectProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value: (string | number)[] = field.value ?? [];
        return (
          <FormControl fullWidth error={Boolean(fieldState.error)}>
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select<(string | number)[]>
              multiple
              labelId={`${name}-label`}
              value={value}
              onChange={(e: SelectChangeEvent<(string | number)[]>) => field.onChange(e.target.value)}
              input={<OutlinedInput label={label} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as (string | number)[]).map((val) => (
                    <Chip
                      key={val}
                      size="small"
                      label={options.find((o) => o.value === val)?.label ?? String(val)}
                    />
                  ))}
                </Box>
              )}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox checked={value.includes(option.value)} size="small" />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
};
