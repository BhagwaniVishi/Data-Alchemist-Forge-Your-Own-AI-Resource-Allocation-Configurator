import React, { useMemo, useState } from 'react';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useWizardStore } from '../../store/wizardStore';
import { ValidatorPanel, ValidationError } from './ValidatorPanel';
import { validateTables } from '../../utils/validateTables';

interface DataReviewStepProps {
  onNext: () => void;
}

export const DataReviewStep: React.FC<DataReviewStepProps> = ({ onNext }) => {
  const tables = useWizardStore((s) => s.tables);
  // The error panel allows selection, but it's not used yet
  const [, setSelectedError] = useState<ValidationError | null>(null);

  const errors = useMemo(() => validateTables(tables), [tables]);

  if (!tables || tables.length === 0) {
    return <Typography color="error">No data loaded.</Typography>;
  }

  // Highlight cells with errors
  const getCellClassName = (tableName: string, rowIdx: number, col: string) => {
    return errors.some(e => e.table === tableName && e.row === rowIdx && e.column === col)
      ? 'cell-error' : '';
  };

  return (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
      <Box flex={1} display="flex" flexDirection="column" gap={4}>
        {tables.map((table) => {
          const columns: GridColDef[] = table.columns.map((col) => ({
            field: col,
            headerName: col,
            width: 150,
            editable: true,
            cellClassName: (params: GridCellParams) =>
              getCellClassName(table.name, params.id as number, col),
          }));
          return (
            <Box key={table.name}>
              <Typography variant="h6" gutterBottom>
                {table.type.toUpperCase()} ({table.name})
              </Typography>
              <DataGrid
                rows={table.data.map((row, i) => ({ id: i, ...row }))}
                columns={columns}
                autoHeight
                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
              />
            </Box>
          );
        })}
        <Button variant="contained" color="primary" onClick={onNext} sx={{ alignSelf: 'flex-end' }} disabled={errors.length > 0}>
          Next: Define Rules
        </Button>
      </Box>
      <ValidatorPanel errors={errors} onSelectError={setSelectedError} />
      <style jsx global>{`
        .cell-error {
          background: #ffeaea !important;
          color: #b71c1c !important;
        }
      `}</style>
    </Box>
  );
};
