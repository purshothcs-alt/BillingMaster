import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Box,
  Checkbox,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { DataGridProps } from './types';

export const DataGrid = <TData,>({
  columns,
  data,
  loading = false,
  getRowId,
  emptyMessage = 'No records found',
  enableGlobalFilter = true,
  searchPlaceholder = 'Search...',
  toolbarActions,
  onRowClick,
  serverPagination,
  onServerPaginationChange,
  sorting: controlledSorting,
  onSortingChange,
  density = 'standard',
  rowSelection,
  onRowSelectionChange,
  enableRowSelection = false,
}: DataGridProps<TData>) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [internalSorting, setInternalSorting] = useState(controlledSorting ?? []);
  const [internalPagination, setInternalPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const isServerMode = Boolean(serverPagination);
  const sortingState = controlledSorting ?? internalSorting;

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting: sortingState,
      rowSelection: rowSelection ?? {},
      pagination: isServerMode
        ? { pageIndex: serverPagination!.pageIndex, pageSize: serverPagination!.pageSize }
        : internalPagination,
    },
    getRowId: getRowId as ((row: TData) => string) | undefined,
    manualPagination: isServerMode,
    manualSorting: Boolean(onSortingChange),
    pageCount: isServerMode
      ? Math.max(1, Math.ceil(serverPagination!.totalRows / serverPagination!.pageSize))
      : undefined,
    enableRowSelection,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(rowSelection ?? {}) : updater;
      onRowSelectionChange?.(next);
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sortingState) : updater;
      if (onSortingChange) {
        onSortingChange(next);
      } else {
        setInternalSorting(next);
      }
    },
    onPaginationChange: (updater) => {
      const current = isServerMode
        ? { pageIndex: serverPagination!.pageIndex, pageSize: serverPagination!.pageSize }
        : internalPagination;
      const next = typeof updater === 'function' ? updater(current) : updater;
      if (isServerMode) {
        onServerPaginationChange?.(next.pageIndex, next.pageSize);
      } else {
        setInternalPagination(next);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: isServerMode ? undefined : getPaginationRowModel(),
  });

  const rowCount = isServerMode ? serverPagination!.totalRows : table.getFilteredRowModel().rows.length;
  const cellPadding = density === 'compact' ? '6px 12px' : undefined;

  const headerGroups = table.getHeaderGroups();

  return (
    <Box>
      {(enableGlobalFilter || toolbarActions) && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={1.5}
          sx={{ mb: 1.5 }}
        >
          {enableGlobalFilter ? (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              sx={{ maxWidth: { sm: 320 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          ) : (
            <Box />
          )}
          {toolbarActions && <Stack direction="row" spacing={1}>{toolbarActions}</Stack>}
        </Stack>
      )}

      <TableContainer sx={{ position: 'relative', borderRadius: 1.5, border: 1, borderColor: 'divider' }}>
        {loading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
        <Table size={density === 'compact' ? 'small' : 'medium'}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {enableRowSelection && (
                  <TableCell padding="checkbox" style={{ padding: cellPadding }}>
                    <Checkbox
                      indeterminate={table.getIsSomeRowsSelected()}
                      checked={table.getIsAllRowsSelected()}
                      onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                  </TableCell>
                )}
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    style={{ padding: cellPadding }}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{ cursor: header.column.getCanSort() ? 'pointer' : 'default', userSelect: 'none' }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      {header.column.getIsSorted() === 'asc' && <ArrowUpwardIcon sx={{ fontSize: 14 }} />}
                      {header.column.getIsSorted() === 'desc' && <ArrowDownwardIcon sx={{ fontSize: 14 }} />}
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {loading && data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (enableRowSelection ? 1 : 0)} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (enableRowSelection ? 1 : 0)} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => onRowClick?.(row.original)}
                  selected={row.getIsSelected()}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {enableRowSelection && (
                    <TableCell padding="checkbox" style={{ padding: cellPadding }}>
                      <Checkbox
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{ padding: cellPadding }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rowCount}
        page={isServerMode ? serverPagination!.pageIndex : internalPagination.pageIndex}
        rowsPerPage={isServerMode ? serverPagination!.pageSize : internalPagination.pageSize}
        onPageChange={(_e, page) => table.setPageIndex(page)}
        onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
};
