export interface BulkImportRowError {
  rowNumber: number;
  errors: Record<string, string[]>;
}

export interface BulkImportResult<T> {
  success: boolean;
  totalRows: number;
  importedCount: number;
  imported: T[];
  errors: BulkImportRowError[];
}
