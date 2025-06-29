'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { AutoFixHigh, CheckCircle, Warning, Error } from '@mui/icons-material';
import { ErrorCorrection } from '@/utils/aiServices';
import { useWizardStore } from '@/store/wizardStore';

interface AIErrorCorrectionProps {
  data: Record<string, unknown>[];
  onApplyCorrection: (correction: ErrorCorrection) => void;
  onApplyAllCorrections: (corrections: ErrorCorrection[]) => void;
}

export default function AIErrorCorrection({
  data,
  onApplyCorrection,
  onApplyAllCorrections
}: AIErrorCorrectionProps) {
  const [corrections, setCorrections] = useState<ErrorCorrection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCorrection, setSelectedCorrection] = useState<ErrorCorrection | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const updateTableRow = useWizardStore((state) => state.updateTableRow);

  const detectErrors = async () => {
    if (data.length === 0) {
      setError('No data available for error detection');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Analyze the actual data for potential errors
      const detectedCorrections: ErrorCorrection[] = [];
      
      data.forEach((row, rowIndex) => {
        Object.entries(row).forEach(([field, value]) => {
          if (typeof value === 'string') {
            // Check for email format issues
            if (field.toLowerCase().includes('email') && value.includes('@') && !value.includes('.')) {
              detectedCorrections.push({
                field,
                originalValue: value,
                suggestedValue: value + '.com',
                confidence: 0.85,
                reason: 'Incomplete email address - missing domain extension',
                correctionType: 'format'
              });
            }
            
            // Check for phone number format issues
            if (field.toLowerCase().includes('phone') && value.length < 10) {
              detectedCorrections.push({
                field,
                originalValue: value,
                suggestedValue: `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`,
                confidence: 0.78,
                reason: 'Phone number format could be standardized',
                correctionType: 'standardization'
              });
            }
            
            // Check for name capitalization
            if (field.toLowerCase().includes('name') && value.length > 0 && value === value.toLowerCase()) {
              detectedCorrections.push({
                field,
                originalValue: value,
                suggestedValue: value.charAt(0).toUpperCase() + value.slice(1),
                confidence: 0.92,
                reason: 'Proper names should be capitalized',
                correctionType: 'format'
              });
            }
            
            // Check for extra whitespace
            if (value !== value.trim()) {
              detectedCorrections.push({
                field,
                originalValue: value,
                suggestedValue: value.trim(),
                confidence: 0.95,
                reason: 'Remove leading/trailing whitespace',
                correctionType: 'format'
              });
            }
          }
        });
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCorrections(detectedCorrections);
    } catch (err) {
      setError('Failed to detect errors');
      console.error('AI error detection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.7) return 'warning';
    return 'error';
  };

  const getCorrectionTypeIcon = (type: string) => {
    switch (type) {
      case 'format':
        return <AutoFixHigh fontSize="small" />;
      case 'spelling':
        return <CheckCircle fontSize="small" />;
      case 'standardization':
        return <Warning fontSize="small" />;
      case 'validation':
        return <Error fontSize="small" />;
      default:
        return <AutoFixHigh fontSize="small" />;
    }
  };

  const handleCorrectionClick = (correction: ErrorCorrection) => {
    setSelectedCorrection(correction);
    setDialogOpen(true);
  };

  const handleApplyCorrection = () => {
    if (selectedCorrection) {
      // Find the row that needs correction
      const rowIndex = data.findIndex(row => 
        row[selectedCorrection.field] === selectedCorrection.originalValue
      );
      
      if (rowIndex !== -1) {
        const updatedRow = { ...data[rowIndex] };
        updatedRow[selectedCorrection.field] = selectedCorrection.suggestedValue;
        
        // Update the data in the store
        updateTableRow(0, rowIndex, updatedRow);
        
        // Remove the correction from the list
        setCorrections(prev => prev.filter(c => c !== selectedCorrection));
      }
      
      setDialogOpen(false);
      setSelectedCorrection(null);
    }
  };

  const handleApplySingleCorrection = (correction: ErrorCorrection) => {
    // Find the row that needs correction
    const rowIndex = data.findIndex(row => 
      row[correction.field] === correction.originalValue
    );
    
    if (rowIndex !== -1) {
      const updatedRow = { ...data[rowIndex] };
      updatedRow[correction.field] = correction.suggestedValue;
      
      // Update the data in the store
      updateTableRow(0, rowIndex, updatedRow);
      
      // Remove the correction from the list
      setCorrections(prev => prev.filter(c => c !== correction));
    }
  };

  const handleApplyAllCorrections = () => {
    corrections.forEach(correction => {
      const rowIndex = data.findIndex(row => 
        row[correction.field] === correction.originalValue
      );
      
      if (rowIndex !== -1) {
        const updatedRow = { ...data[rowIndex] };
        updatedRow[correction.field] = correction.suggestedValue;
        updateTableRow(0, rowIndex, updatedRow);
      }
    });
    
    setCorrections([]);
  };

  return (
    <>
      <Card sx={{ width: '100%', mb: 2 }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <AutoFixHigh color="primary" />
              <Typography variant="h6">AI Error Correction</Typography>
            </Box>
          }
          subheader="Let AI detect and suggest fixes for data errors"
          action={
            <Button
              variant="contained"
              onClick={detectErrors}
              disabled={loading || data.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <AutoFixHigh />}
            >
              {loading ? 'Detecting...' : 'Detect Errors'}
            </Button>
          }
        />
        
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {corrections.length > 0 && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">
                  Found {corrections.length} potential errors
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleApplyAllCorrections}
                >
                  Apply All Corrections
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {corrections.map((correction, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: 'background.paper',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                    onClick={() => handleCorrectionClick(correction)}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          {getCorrectionTypeIcon(correction.correctionType)}
                          <Typography variant="subtitle2" fontWeight="bold">
                            {correction.field}
                          </Typography>
                          <Chip
                            label={correction.correctionType}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={`${Math.round(correction.confidence * 100)}% confidence`}
                            size="small"
                            color={getConfidenceColor(correction.confidence) as 'success' | 'warning' | 'error'}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography component="span" variant="body2" color="text.secondary" display="block" mb={1}>
                            <strong>From:</strong> {correction.originalValue}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.secondary" display="block" mb={1}>
                            <strong>To:</strong> {correction.suggestedValue}
                          </Typography>
                          <Typography component="span" variant="caption" color="text.secondary" display="block">
                            {correction.reason}
                          </Typography>
                        </Box>
                      }
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplySingleCorrection(correction);
                      }}
                      sx={{ ml: 2 }}
                    >
                      Apply
                    </Button>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {!loading && corrections.length === 0 && !error && (
            <Box textAlign="center" py={4}>
              <AutoFixHigh sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Click &quot;Detect Errors&quot; to find and fix data issues
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Correction Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AutoFixHigh color="primary" />
            Correction Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCorrection && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Field: {selectedCorrection.field}
              </Typography>
              
              <TextField
                fullWidth
                label="Original Value"
                value={selectedCorrection.originalValue}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              
              <TextField
                fullWidth
                label="Suggested Value"
                value={selectedCorrection.suggestedValue}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              
              <TextField
                fullWidth
                label="Reason"
                value={selectedCorrection.reason}
                margin="normal"
                multiline
                rows={3}
                InputProps={{ readOnly: true }}
              />
              
              <Box display="flex" gap={1} mt={2}>
                <Chip
                  label={selectedCorrection.correctionType}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`${Math.round(selectedCorrection.confidence * 100)}% confidence`}
                  color={getConfidenceColor(selectedCorrection.confidence) as 'success' | 'warning' | 'error'}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApplyCorrection} variant="contained">
            Apply Correction
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 