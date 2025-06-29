import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export interface ValidationError {
  table: string;
  row: number;
  column: string;
  message: string;
  severity?: 'error' | 'warning';
}

interface ValidatorPanelProps {
  errors: ValidationError[];
  onSelectError?: (error: ValidationError) => void;
}

export const ValidatorPanel: React.FC<ValidatorPanelProps> = ({ errors, onSelectError }) => {
  const [showInfo, setShowInfo] = useState(true);
  if (!errors.length) return null;
  return (
    <Box sx={{ minWidth: 260, maxWidth: 340, bgcolor: 'background.paper', border: '1px solid #eee', borderRadius: 2, p: 2 }}>
      {showInfo && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowInfo(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <strong>Note:</strong> Warnings do not block progress. You can proceed to the next step even if warnings are present.
        </Alert>
      )}
      <Typography variant="h6" gutterBottom color="text.primary" fontWeight={600}>
        Validation Errors ({errors.length})
      </Typography>
      <List dense>
        {errors.map((err, idx) => (
          <ListItem key={idx} onClick={() => onSelectError?.(err)} style={onSelectError ? { cursor: 'pointer' } : {}}>
            <ListItemText
              primary={
                <span style={{ color: err.severity === 'error' ? '#d32f2f' : '#ed6c02', fontWeight: 500 }}>
                  [{err.table}] Row {err.row + 1}, Column &quot;{err.column}&quot;
                </span>
              }
              secondary={
                <span style={{ color: '#333', fontWeight: 500 }}>
                  {err.message}
                </span>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
