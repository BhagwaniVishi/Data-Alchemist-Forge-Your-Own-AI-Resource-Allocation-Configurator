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
  Chip,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { SmartToy, Edit, Preview, CheckCircle } from '@mui/icons-material';

interface NaturalLanguageModificationProps {
  data: Record<string, unknown>[];
  onApplyModification: (modifiedData: Record<string, unknown>[]) => void;
}

export default function NaturalLanguageModification({
  data,
  onApplyModification
}: NaturalLanguageModificationProps) {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const processModification = async () => {
    if (!instruction.trim()) {
      setError('Please enter a modification instruction');
      return;
    }

    if (data.length === 0) {
      setError('No data available for modification');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock AI data modification for now - replace with actual AI service call
      const mockModifiedData = data.map(row => {
        const modifiedRow = { ...row };
        
        // Simple mock transformations based on instruction keywords
        if (instruction.toLowerCase().includes('capitalize')) {
          Object.keys(modifiedRow).forEach(key => {
            if (typeof modifiedRow[key] === 'string') {
              modifiedRow[key] = (modifiedRow[key] as string).toUpperCase();
            }
          });
        }
        
        if (instruction.toLowerCase().includes('lowercase')) {
          Object.keys(modifiedRow).forEach(key => {
            if (typeof modifiedRow[key] === 'string') {
              modifiedRow[key] = (modifiedRow[key] as string).toLowerCase();
            }
          });
        }
        
        if (instruction.toLowerCase().includes('trim')) {
          Object.keys(modifiedRow).forEach(key => {
            if (typeof modifiedRow[key] === 'string') {
              modifiedRow[key] = (modifiedRow[key] as string).trim();
            }
          });
        }
        
        return modifiedRow;
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPreviewData(mockModifiedData);
      setPreviewDialogOpen(true);
    } catch (err) {
      setError('Failed to process modification');
      console.error('AI modification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyModification = () => {
    onApplyModification(previewData);
    setPreviewDialogOpen(false);
    setInstruction('');
    setPreviewData([]);
  };

  const getInstructionExamples = () => [
    'Capitalize all text fields',
    'Convert all text to lowercase',
    'Trim whitespace from all fields',
    'Standardize date format to YYYY-MM-DD',
    'Add prefix "ID-" to all ID fields',
    'Remove special characters from names'
  ];

  return (
    <>
      <Card sx={{ width: '100%', mb: 2 }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <SmartToy color="primary" />
              <Typography variant="h6">Natural Language Modification</Typography>
            </Box>
          }
          subheader="Modify your data using plain English instructions"
        />
        
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Modification Instruction"
            placeholder="e.g., Capitalize all text fields, standardize date formats, etc."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box display="flex" gap={1} mb={2}>
            <Button
              variant="contained"
              onClick={processModification}
              disabled={loading || !instruction.trim() || data.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <Edit />}
            >
              {loading ? 'Processing...' : 'Process Modification'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setInstruction('')}
              disabled={loading}
            >
              Clear
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Example Instructions:
          </Typography>
          
          <Box display="flex" flexWrap="wrap" gap={1}>
            {getInstructionExamples().map((example, index) => (
              <Chip
                key={index}
                label={example}
                size="small"
                variant="outlined"
                onClick={() => setInstruction(example)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>

          {!loading && data.length > 0 && (
            <Box mt={2} p={2} bgcolor="background.paper" borderRadius={1}>
              <Typography variant="body2" color="text.secondary">
                <strong>Data Preview:</strong> {data.length} rows available for modification
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Fields: {Object.keys(data[0] || {}).join(', ')}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Preview color="primary" />
            Modification Preview
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Preview of your data after applying: &quot;{instruction}&quot;
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box maxHeight={400} overflow="auto">
            <List dense>
              {previewData.slice(0, 10).map((row, index) => (
                <ListItem key={index} sx={{ border: 1, borderColor: 'divider', mb: 1, borderRadius: 1 }}>
                  <ListItemText
                    primary={`Row ${index + 1}`}
                    secondary={
                      <Box>
                        {Object.entries(row).map(([key, value]) => (
                          <Typography key={key} variant="caption" display="block">
                            <strong>{key}:</strong> {String(value)}
                          </Typography>
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            {previewData.length > 10 && (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                ... and {previewData.length - 10} more rows
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleApplyModification} 
            variant="contained"
            startIcon={<CheckCircle />}
          >
            Apply Modification
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 