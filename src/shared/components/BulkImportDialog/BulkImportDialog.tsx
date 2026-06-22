import { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Modal } from '../Modal/Modal';
import { getErrorMessage } from '@/services/api/baseApi';
import type { BulkImportResult } from '@/shared/types/bulkImport';

const PREVIEW_ROW_LIMIT = 5;

interface BulkImportDialogProps<T> {
  open: boolean;
  onClose: () => void;
  title: string;
  expectedColumns: string[];
  onDownloadTemplate: () => Promise<Blob>;
  templateFileName: string;
  onUpload: (file: File) => Promise<BulkImportResult<T>>;
  onImportSuccess: (result: BulkImportResult<T>) => void;
}

const isBulkImportResult = (value: unknown): value is BulkImportResult<unknown> =>
  typeof value === 'object' && value !== null && 'success' in value && 'errors' in value;

const parseCsvPreview = (file: File) =>
  new Promise<{ headers: string[]; rows: Record<string, string>[] }>((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      preview: PREVIEW_ROW_LIMIT,
      complete: (results) => resolve({ headers: results.meta.fields ?? [], rows: results.data }),
      error: (error) => reject(error),
    });
  });

const parseExcelPreview = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
  const headers = (rows[0] ?? []).map((h) => String(h));
  const dataRows = rows.slice(1, PREVIEW_ROW_LIMIT + 1).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, String(row[index] ?? '')])),
  );
  return { headers, rows: dataRows };
};

export function BulkImportDialog<T>({
  open,
  onClose,
  title,
  expectedColumns,
  onDownloadTemplate,
  templateFileName,
  onUpload,
  onImportSuccess,
}: BulkImportDialogProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkImportResult<T> | null>(null);

  const reset = () => {
    setFile(null);
    setPreviewHeaders([]);
    setPreviewRows([]);
    setParseError(null);
    setUploadResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setUploadResult(null);
    setParseError(null);
    setFile(selected);
    setPreviewHeaders([]);
    setPreviewRows([]);
    if (!selected) return;

    try {
      const extension = selected.name.split('.').pop()?.toLowerCase();
      const preview =
        extension === 'csv' ? await parseCsvPreview(selected) : await parseExcelPreview(selected);
      setPreviewHeaders(preview.headers);
      setPreviewRows(preview.rows);
    } catch (error) {
      setParseError(getErrorMessage(error));
    }
  };

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      const blob = await onDownloadTemplate();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = templateFileName;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadResult(null);
    try {
      const result = await onUpload(file);
      if (result.success) {
        onImportSuccess(result);
        handleClose();
      } else {
        setUploadResult(result);
      }
    } catch (error) {
      const data = (error as { data?: unknown } | undefined)?.data;
      if (isBulkImportResult(data)) {
        setUploadResult(data as BulkImportResult<T>);
      } else {
        setUploadResult({
          success: false,
          totalRows: 0,
          importedCount: 0,
          imported: [],
          errors: [{ rowNumber: 0, errors: { File: [getErrorMessage(error)] } }],
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      maxWidth="md"
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleImport} disabled={!file} loading={isUploading}>
            Import
          </Button>
        </>
      }
    >
      <Stack spacing={2.5} sx={{ mt: 0.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Expected columns: {expectedColumns.join(', ')}
          </Typography>
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadTemplate}
            loading={isDownloading}
          >
            Download template
          </Button>
        </Stack>

        <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
          {file ? file.name : 'Choose CSV or Excel file'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        {parseError && <Alert severity="error">{parseError}</Alert>}

        {previewRows.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Preview (first {previewRows.length} rows)
            </Typography>
            <TableContainer sx={{ maxHeight: 240, mt: 0.5 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {previewHeaders.map((header) => (
                      <TableCell key={header}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewRows.map((row, index) => (
                    <TableRow key={index}>
                      {previewHeaders.map((header) => (
                        <TableCell key={header}>{row[header]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {uploadResult && !uploadResult.success && (
          <Alert severity="error">
            <Typography variant="subtitle2" gutterBottom>
              Import rejected — no rows were saved. Fix the issues below and re-upload.
            </Typography>
            <Stack spacing={0.5}>
              {uploadResult.errors.map((rowError) => (
                <Typography key={rowError.rowNumber} variant="body2">
                  Row {rowError.rowNumber}:{' '}
                  {Object.entries(rowError.errors)
                    .map(([field, messages]) => `${field} — ${messages.join(', ')}`)
                    .join('; ')}
                </Typography>
              ))}
            </Stack>
          </Alert>
        )}
      </Stack>
    </Modal>
  );
}
