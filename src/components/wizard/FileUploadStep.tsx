import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface FileUploadStepProps {
  onFilesLoaded: (files: FileList) => void;
}

export const FileUploadStep: React.FC<FileUploadStepProps> = ({ onFilesLoaded }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <input
        ref={inputRef}
        type="file"
        accept=".csv, .xlsx"
        multiple
        style={{ display: 'none' }}
        onChange={e => {
          if (e.target.files) onFilesLoaded(e.target.files);
        }}
      />
      <Button variant="contained" onClick={() => inputRef.current?.click()}>
        Upload CSV/XLSX Files
      </Button>
      <Box color="text.secondary" fontSize={14}>
        Accepts client, worker, and task files. Flexible headers.
      </Box>
    </Box>
  );
};
