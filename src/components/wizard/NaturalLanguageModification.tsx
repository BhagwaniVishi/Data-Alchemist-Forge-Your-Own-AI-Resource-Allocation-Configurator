'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Chat, AutoFixHigh, CheckCircle } from '@mui/icons-material';
import { useWizardStore, RowData } from '@/store/wizardStore';

interface NaturalLanguageModificationProps {
  data: Record<string, unknown>[];
}

export default function NaturalLanguageModification({
  data
}: NaturalLanguageModificationProps) {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modifications, setModifications] = useState<Array<{
    field: string;
    originalValue: string;
    newValue: string;
    reason: string;
  }>>([]);
  const [selectedModification, setSelectedModification] = useState<{
    field: string;
    originalValue: string;
    newValue: string;
    reason: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const updateTableRow = useWizardStore((state) => state.updateTableRow);

  const processInstruction = async () => {
    if (!instruction.trim() || data.length === 0) {
      setError('Please provide an instruction and ensure data is available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate AI processing with mock modifications based on the instruction
      const mockModifications: Array<{
        field: string;
        originalValue: string;
        newValue: string;
        reason: string;
      }> = [];

      // Analyze the instruction and apply logic
      const lowerInstruction = instruction.toLowerCase();
      
      if (lowerInstruction.includes('capitalize') || lowerInstruction.includes('uppercase')) {
        data.forEach((row) => {
          Object.entries(row).forEach(([field, value]) => {
            if (typeof value === 'string' && value.length > 0) {
              const capitalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
              if (capitalized !== value) {
                mockModifications.push({
                  field,
                  originalValue: value,
                  newValue: capitalized,
                  reason: 'Capitalized first letter and made rest lowercase'
                });
              }
            }
          });
        });
      } else if (lowerInstruction.includes('trim') || lowerInstruction.includes('whitespace')) {
        data.forEach((row) => {
          Object.entries(row).forEach(([field, value]) => {
            if (typeof value === 'string' && value !== value.trim()) {
              mockModifications.push({
                field,
                originalValue: value,
                newValue: value.trim(),
                reason: 'Removed leading and trailing whitespace'
              });
            }
          });
        });
      } else if (lowerInstruction.includes('email') && lowerInstruction.includes('format')) {
        data.forEach((row) => {
          Object.entries(row).forEach(([field, value]) => {
            if (typeof value === 'string' && field.toLowerCase().includes('email') && value.includes('@')) {
              const formatted = value.toLowerCase().trim();
              if (formatted !== value) {
                mockModifications.push({
                  field,
                  originalValue: value,
                  newValue: formatted,
                  reason: 'Standardized email format (lowercase, trimmed)'
                });
              }
            }
          });
        });
      } else if (lowerInstruction.includes('phone') && lowerInstruction.includes('format')) {
        data.forEach((row) => {
          Object.entries(row).forEach(([field, value]) => {
            if (typeof value === 'string' && field.toLowerCase().includes('phone')) {
              const digits = value.replace(/\D/g, '');
              if (digits.length === 10) {
                const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                if (formatted !== value) {
                  mockModifications.push({
                    field,
                    originalValue: value,
                    newValue: formatted,
                    reason: 'Formatted phone number as (XXX) XXX-XXXX'
                  });
                }
              }
            }
          });
        });
      } else {
        // Generic text replacement based on instruction
        data.forEach((row) => {
          Object.entries(row).forEach(([field, value]) => {
            if (typeof value === 'string' && value.length > 0) {
              // Simple text transformations based on common instructions
              let newValue = value;
              
              if (lowerInstruction.includes('uppercase')) {
                newValue = value.toUpperCase();
              } else if (lowerInstruction.includes('lowercase')) {
                newValue = value.toLowerCase();
              } else if (lowerInstruction.includes('replace') && lowerInstruction.includes('with')) {
                // Extract replacement pattern from instruction
                const replaceMatch = instruction.match(/replace\s+["']([^"']+)["']\s+with\s+["']([^"']+)["']/i);
                if (replaceMatch) {
                  const [, from, to] = replaceMatch;
                  newValue = value.replace(new RegExp(from, 'gi'), to);
                }
              }
              
              if (newValue !== value) {
                mockModifications.push({
                  field,
                  originalValue: value,
                  newValue,
                  reason: `Applied transformation based on instruction: "${instruction}"`
                });
              }
            }
          });
        });
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setModifications(mockModifications);
    } catch (err) {
      setError('Failed to process instruction');
      console.error('Natural language modification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleModificationClick = (modification: {
    field: string;
    originalValue: string;
    newValue: string;
    reason: string;
  }) => {
    setSelectedModification(modification);
    setDialogOpen(true);
  };

  const handleApplyModification = () => {
    if (selectedModification) {
      // Find the row that needs modification
      const rowIndex = data.findIndex(row => 
        row[selectedModification.field] === selectedModification.originalValue
      );
      
      if (rowIndex !== -1) {
        const updatedRow = { ...data[rowIndex] } as RowData;
        updatedRow[selectedModification.field] = selectedModification.newValue;
        
        // Update the data in the store
        updateTableRow(0, rowIndex, updatedRow);
        
        // Remove the modification from the list
        setModifications(prev => prev.filter(m => m !== selectedModification));
      }
      
      setDialogOpen(false);
      setSelectedModification(null);
    }
  };

  const handleApplySingleModification = (modification: {
    field: string;
    originalValue: string;
    newValue: string;
    reason: string;
  }) => {
    // Find the row that needs modification
    const rowIndex = data.findIndex(row => 
      row[modification.field] === modification.originalValue
    );
    
    if (rowIndex !== -1) {
      const updatedRow = { ...data[rowIndex] } as RowData;
      updatedRow[modification.field] = modification.newValue;
      
      // Update the data in the store
      updateTableRow(0, rowIndex, updatedRow);
      
      // Remove the modification from the list
      setModifications(prev => prev.filter(m => m !== modification));
    }
  };

  const handleApplyAllModifications = () => {
    modifications.forEach(modification => {
      const rowIndex = data.findIndex(row => 
        row[modification.field] === modification.originalValue
      );
      
      if (rowIndex !== -1) {
        const updatedRow = { ...data[rowIndex] } as RowData;
        updatedRow[modification.field] = modification.newValue;
        updateTableRow(0, rowIndex, updatedRow);
      }
    });
    
    setModifications([]);
  };

  return (
    <>
      <Card sx={{ width: '100%', mb: 2 }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <Chat color="primary" />
              <Typography variant="h6">Natural Language Modification</Typography>
            </Box>
          }
          subheader="Describe data changes in plain English"
        />
        
        <CardContent>
          <Box display="flex" gap={2} mb={3}>
            <TextField
              fullWidth
              label="Describe the changes you want to make"
              placeholder="e.g., 'Capitalize all names', 'Format phone numbers', 'Replace 'old' with 'new''"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              multiline
              rows={2}
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={processInstruction}
              disabled={loading || !instruction.trim() || data.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <AutoFixHigh />}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Processing...' : 'Apply'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {modifications.length > 0 && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">
                  {modifications.length} modification{modifications.length !== 1 ? 's' : ''} ready to apply
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleApplyAllModifications}
                >
                  Apply All Changes
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {modifications.map((modification, index) => (
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
                    onClick={() => handleModificationClick(modification)}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <CheckCircle color="success" fontSize="small" />
                          <Typography variant="subtitle2" fontWeight="bold">
                            {modification.field}
                          </Typography>
                          <Chip
                            label="Modification"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography component="span" variant="body2" color="text.secondary" display="block" mb={1}>
                            <strong>From:</strong> {modification.originalValue}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.secondary" display="block" mb={1}>
                            <strong>To:</strong> {modification.newValue}
                          </Typography>
                          <Typography component="span" variant="caption" color="text.secondary" display="block">
                            {modification.reason}
                          </Typography>
                        </Box>
                      }
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplySingleModification(modification);
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

          {!loading && modifications.length === 0 && !error && (
            <Box textAlign="center" py={4}>
              <Chat sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Describe the changes you want to make to your data
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Modification Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Chat color="primary" />
            Modification Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedModification && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Field: {selectedModification.field}
              </Typography>
              
              <TextField
                fullWidth
                label="Original Value"
                value={selectedModification.originalValue}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              
              <TextField
                fullWidth
                label="New Value"
                value={selectedModification.newValue}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              
              <TextField
                fullWidth
                label="Reason"
                value={selectedModification.reason}
                margin="normal"
                multiline
                rows={3}
                InputProps={{ readOnly: true }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApplyModification} variant="contained">
            Apply Modification
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 