import type { ColumnDef } from '@tanstack/react-table';
import type { Control, FieldValues } from 'react-hook-form';
import type { ZodType } from 'zod';
import type { ReactNode } from 'react';

export interface EntityMutationHooks<TEntity, TFormValues extends FieldValues> {
  useList: () => { data?: TEntity[]; isLoading: boolean; isFetching: boolean; refetch: () => void };
  useCreate: () => [
    (values: TFormValues) => Promise<unknown>,
    { isLoading: boolean },
  ];
  useUpdate: () => [
    (args: { id: string; values: TFormValues }) => Promise<unknown>,
    { isLoading: boolean },
  ];
  useRemove: () => [(id: string) => Promise<unknown>, { isLoading: boolean }];
}

export interface EntityCrudPageProps<TEntity extends { id: string }, TFormValues extends FieldValues> {
  title: string;
  subtitle?: string;
  entityLabel: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- column value types vary per row shape
  columns: ColumnDef<TEntity, any>[];
  hooks: EntityMutationHooks<TEntity, TFormValues>;
  schema: ZodType<TFormValues>;
  defaultValues: TFormValues;
  renderFormFields: (control: Control<TFormValues>) => ReactNode;
  toEditValues: (entity: TEntity) => TFormValues;
  canManage?: boolean;
  searchPlaceholder?: string;
  getRowLabel?: (entity: TEntity) => string;
  extraToolbar?: ReactNode;
  dialogMaxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}
