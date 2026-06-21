import { useState } from 'react';
import { useForm, type DefaultValues, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, IconButton, Stack, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '../PageHeader/PageHeader';
import { DataGrid } from '../DataGrid/DataGrid';
import { Modal } from '../Modal/Modal';
import { useConfirm } from '../ConfirmDialog/ConfirmDialogProvider';
import { useAppDispatch } from '@/app/hooks';
import { toastError, toastSuccess } from '@/features/ui/toastSlice';
import { getErrorMessage } from '@/services/api/baseApi';
import type { EntityCrudPageProps } from './types';

const isErrorResult = (result: unknown): result is { error: unknown } =>
  typeof result === 'object' && result !== null && 'error' in result && Boolean((result as { error: unknown }).error);

export const EntityCrudPage = <TEntity extends { id: string }, TFormValues extends FieldValues>({
  title,
  subtitle,
  entityLabel,
  columns,
  hooks,
  schema,
  defaultValues,
  renderFormFields,
  toEditValues,
  canManage = true,
  searchPlaceholder,
  getRowLabel,
  extraToolbar,
  dialogMaxWidth = 'sm',
}: EntityCrudPageProps<TEntity, TFormValues>) => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { data, isLoading, isFetching } = hooks.useList();
  const [createEntity, { isLoading: isCreating }] = hooks.useCreate();
  const [updateEntity, { isLoading: isUpdating }] = hooks.useUpdate();
  const [removeEntity] = hooks.useRemove();

  const [dialogState, setDialogState] = useState<{ mode: 'create' | 'edit'; entity?: TEntity } | null>(
    null,
  );

  const form = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<TFormValues>,
  });

  const openCreate = () => {
    form.reset(defaultValues);
    setDialogState({ mode: 'create' });
  };

  const openEdit = (entity: TEntity) => {
    form.reset(toEditValues(entity));
    setDialogState({ mode: 'edit', entity });
  };

  const closeDialog = () => {
    setDialogState(null);
    form.reset(defaultValues);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      if (dialogState?.mode === 'edit' && dialogState.entity) {
        const result = await updateEntity({ id: dialogState.entity.id, values });
        if (isErrorResult(result)) throw result.error;
        dispatch(toastSuccess(`${entityLabel} updated successfully.`));
      } else {
        const result = await createEntity(values);
        if (isErrorResult(result)) throw result.error;
        dispatch(toastSuccess(`${entityLabel} created successfully.`));
      }
      closeDialog();
    } catch (error) {
      dispatch(toastError(getErrorMessage(error)));
    }
  });

  const handleDelete = async (entity: TEntity) => {
    const ok = await confirm({
      title: `Delete ${entityLabel}`,
      message: `Are you sure you want to delete ${getRowLabel ? `"${getRowLabel(entity)}"` : 'this record'}? This action cannot be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    try {
      const result = await removeEntity(entity.id);
      if (isErrorResult(result)) throw result.error;
      dispatch(toastSuccess(`${entityLabel} deleted successfully.`));
    } catch (error) {
      dispatch(toastError(getErrorMessage(error)));
    }
  };

  const columnHelper = createColumnHelper<TEntity>();

  const fullColumns = canManage
    ? [
        ...columns,
        columnHelper.display({
          id: 'actions',
          header: 'Actions',
          cell: ({ row }) => (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => openEdit(row.original)}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => handleDelete(row.original)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          ),
        }) as (typeof columns)[number],
      ]
    : columns;

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          canManage ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Add {entityLabel}
            </Button>
          ) : undefined
        }
      />

      <DataGrid
        columns={fullColumns}
        data={data ?? []}
        loading={isLoading || isFetching}
        searchPlaceholder={searchPlaceholder ?? `Search ${entityLabel.toLowerCase()}s...`}
        toolbarActions={extraToolbar}
        emptyMessage={`No ${entityLabel.toLowerCase()}s found. Click "Add ${entityLabel}" to create one.`}
      />

      <Modal
        open={Boolean(dialogState)}
        onClose={closeDialog}
        title={dialogState?.mode === 'edit' ? `Edit ${entityLabel}` : `Add ${entityLabel}`}
        maxWidth={dialogMaxWidth}
        actions={
          <>
            <Button onClick={closeDialog} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              loading={isCreating || isUpdating}
            >
              Save
            </Button>
          </>
        }
      >
        <Stack spacing={2.5} component="form" sx={{ mt: 0.5 }} onSubmit={handleSubmit}>
          {renderFormFields(form.control)}
        </Stack>
      </Modal>
    </>
  );
};
