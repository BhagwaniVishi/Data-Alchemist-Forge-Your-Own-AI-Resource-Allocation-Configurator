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

  const detectErrors = async () => {
    if (data.length === 0) {
      setError('No data available for error detection');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock AI error corrections for now - replace with actual AI service call
      const mockCorrections: ErrorCorrection[] = [
        {
          field: 'email',
          originalValue: 'john.doe@email',
          suggestedValue: 'john.doe@email.com',
          confidence: 0.95,
          reason: 'Incomplete email address - missing domain extension',
          correctionType: 'format'
        },
        {
          field: 'phone',
          originalValue: '123-456-789',
          suggestedValue: '(123) 456-7890',
          confidence: 0.88,
          reason: 'Standardize phone number format',
          correctionType: 'standardization'
        },
        {
          field: 'name',
          originalValue: 'john doe',
          suggestedValue: 'John Doe',
          confidence: 0.92,
          reason: 'Capitalize proper names',
          correctionType: 'format'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setCorrections(mockCorrections);
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
      onApplyCorrection(selectedCorrection);
      setDialogOpen(false);
      setSelectedCorrection(null);
    }
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
                  onClick={() => onApplyAllCorrections(corrections)}
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
                        onApplyCorrection(correction);
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