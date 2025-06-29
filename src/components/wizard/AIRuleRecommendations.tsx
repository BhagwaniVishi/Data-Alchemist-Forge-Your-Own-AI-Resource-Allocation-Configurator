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
  Divider
} from '@mui/material';
import { AutoAwesome, CheckCircle, Lightbulb } from '@mui/icons-material';
import { RuleRecommendation } from '@/utils/aiServices';

interface AIRuleRecommendationsProps {
  data: Record<string, unknown>[];
  onApplyRule: (rule: RuleRecommendation) => void;
  onApplyAllRules: (rules: RuleRecommendation[]) => void;
}

export default function AIRuleRecommendations({
  data,
  onApplyRule,
  onApplyAllRules
}: AIRuleRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RuleRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async () => {
    if (data.length === 0) {
      setError('No data available for analysis');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock AI recommendations for now - replace with actual AI service call
      const mockRecommendations: RuleRecommendation[] = [
        {
          id: 'email-validation-001',
          name: 'Email Format Validation',
          description: 'Validate email addresses are in correct format',
          category: 'validation',
          confidence: 0.95,
          ruleDefinition: 'field matches email regex pattern',
          examples: ['john@example.com', 'invalid-email']
        },
        {
          id: 'phone-format-002',
          name: 'Phone Number Standardization',
          description: 'Standardize phone numbers to consistent format',
          category: 'formatting',
          confidence: 0.88,
          ruleDefinition: 'format phone as (XXX) XXX-XXXX',
          examples: ['1234567890', '(123) 456-7890']
        },
        {
          id: 'age-validation-003',
          name: 'Age Range Validation',
          description: 'Validate age is within reasonable range',
          category: 'validation',
          confidence: 0.92,
          ruleDefinition: 'age >= 0 AND age <= 120',
          examples: ['25', '150', '-5']
        },
        {
          id: 'name-capitalization-004',
          name: 'Name Capitalization',
          description: 'Ensure proper name capitalization',
          category: 'transformation',
          confidence: 0.85,
          ruleDefinition: 'capitalize first letter of each word',
          examples: ['john doe', 'JOHN DOE', 'John Doe']
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRecommendations(mockRecommendations);
    } catch (err) {
      setError('Failed to generate AI recommendations');
      console.error('AI recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.7) return 'warning';
    return 'error';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'validation':
        return <CheckCircle fontSize="small" />;
      case 'transformation':
        return <AutoAwesome fontSize="small" />;
      case 'formatting':
        return <Lightbulb fontSize="small" />;
      case 'business':
        return <Lightbulb fontSize="small" />;
      default:
        return <Lightbulb fontSize="small" />;
    }
  };

  return (
    <Card sx={{ width: '100%', mb: 2 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <AutoAwesome color="primary" />
            <Typography variant="h6">AI Rule Recommendations</Typography>
          </Box>
        }
        subheader="Let AI analyze your data and suggest validation rules"
        action={
          <Button
            variant="contained"
            onClick={generateRecommendations}
            disabled={loading || data.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : <Lightbulb />}
          >
            {loading ? 'Analyzing...' : 'Generate Recommendations'}
          </Button>
        }
      />
      
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {recommendations.length > 0 && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">
                Found {recommendations.length} recommendations
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => onApplyAllRules(recommendations)}
              >
                Apply All Rules
              </Button>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {recommendations.map((rule) => (
                <ListItem
                  key={rule.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: 'background.paper'
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {getCategoryIcon(rule.category)}
                        <Typography variant="subtitle2" fontWeight="bold">
                          {rule.name}
                        </Typography>
                        <Chip
                          label={rule.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={`${Math.round(rule.confidence * 100)}% confidence`}
                          size="small"
                          color={getConfidenceColor(rule.confidence) as 'success' | 'warning' | 'error'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography component="span" variant="body2" color="text.secondary" display="block" mb={1}>
                          {rule.description}
                        </Typography>
                        <Typography component="span" variant="caption" color="text.secondary" display="block" mb={1}>
                          <strong>Rule:</strong> {rule.ruleDefinition}
                        </Typography>
                        <Typography component="span" variant="caption" color="text.secondary" display="block">
                          <strong>Examples:</strong> {rule.examples.join(', ')}
                        </Typography>
                      </Box>
                    }
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onApplyRule(rule)}
                    sx={{ ml: 2 }}
                  >
                    Apply
                  </Button>
                </ListItem>
              ))}
            </List>
          </>
        )}

        {!loading && recommendations.length === 0 && !error && (
          <Box textAlign="center" py={4}>
            <Lightbulb sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Click &quot;Generate Recommendations&quot; to get AI-powered rule suggestions
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
} 