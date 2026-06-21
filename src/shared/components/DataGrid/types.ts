import type { ColumnDef, SortingState } from '@tanstack/react-table';

export interface ServerPagination {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
}

export interface DataGridProps<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- column value types vary per row shape
  columns: ColumnDef<TData, any>[];
  data: TData[];
  loading?: boolean;
  getRowId?: (row: TData) => string;
  emptyMessage?: string;
  enableGlobalFilter?: boolean;
  searchPlaceholder?: string;
  toolbarActions?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  /** Provide for server-driven pagination/sorting; omit for client-side mode. */
  serverPagination?: ServerPagination;
  onServerPaginationChange?: (pageIndex: number, pageSize: number) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  density?: 'compact' | 'standard';
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (selection: Record<string, boolean>) => void;
  enableRowSelection?: boolean;
}
