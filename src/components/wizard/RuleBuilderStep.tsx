import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Card, CardContent, CardHeader } from '@mui/material';
import AIRuleRecommendations from './AIRuleRecommendations';
import AIErrorCorrection from './AIErrorCorrection';
import NaturalLanguageModification from './NaturalLanguageModification';
import { RuleRecommendation, ErrorCorrection } from '@/utils/aiServices';

const RULE_TYPES = [
  { type: 'co-run', label: 'Co-run (tasks that must go together)' },
  { type: 'load-limit', label: 'Load Limit' },
  { type: 'phase-window', label: 'Phase Window' },
];

export interface Rule {
  type: string;
  params: Record<string, string | number | boolean>;
}

interface RuleBuilderStepProps {
  onNext: () => void;
  data: Record<string, unknown>[];
}

export const RuleBuilderStep: React.FC<RuleBuilderStepProps> = ({ onNext, data }) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedType, setSelectedType] = useState<string>('co-run');
  const [param, setParam] = useState('');

  const addRule = () => {
    if (!param) return;
    setRules([...rules, { type: selectedType, params: { value: param } }]);
    setParam('');
  };

  const handleApplyRule = (rule: RuleRecommendation) => {
    // Convert AI recommendation to a rule
    const newRule: Rule = {
      type: rule.ruleType,
      params: {
        field: rule.field,
        condition: rule.condition,
        description: rule.description
      }
    };
    setRules([...rules, newRule]);
  };

  const handleApplyAllRules = (aiRules: RuleRecommendation[]) => {
    const newRules = aiRules.map(rule => ({
      type: rule.ruleType,
      params: {
        field: rule.field,
        condition: rule.condition,
        description: rule.description
      }
    }));
    setRules([...rules, ...newRules]);
  };

  const handleApplyCorrection = (correction: ErrorCorrection) => {
    // Apply error correction to data
    console.log('Applying correction:', correction);
    // This would typically update the data in the store
  };

  const handleApplyAllCorrections = (corrections: ErrorCorrection[]) => {
    // Apply all corrections to data
    console.log('Applying all corrections:', corrections);
    // This would typically update the data in the store
  };

  const handleApplyModification = (modifiedData: Record<string, unknown>[]) => {
    // Apply natural language modification to data
    console.log('Applying modification to data:', modifiedData);
    // This would typically update the data in the store
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h4" gutterBottom>
        AI-Powered Rule Builder
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Use AI to analyze your data and automatically generate validation rules, 
        detect errors, and modify data using natural language.
      </Typography>

      {/* AI Rule Recommendations */}
      <Box>
        <AIRuleRecommendations
          data={data}
          onApplyRule={handleApplyRule}
          onApplyAllRules={handleApplyAllRules}
        />
      </Box>

      {/* AI Error Correction */}
      <Box>
        <AIErrorCorrection
          data={data}
          onApplyCorrection={handleApplyCorrection}
          onApplyAllCorrections={handleApplyAllCorrections}
        />
      </Box>

      {/* Natural Language Modification */}
      <Box>
        <NaturalLanguageModification
          data={data}
          onApplyModification={handleApplyModification}
        />
      </Box>

      {/* Manual Rule Builder */}
      <Card>
        <CardHeader
          title="Manual Rule Builder"
          subheader="Create custom rules manually"
        />
        <CardContent>
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <select 
              value={selectedType} 
              onChange={e => setSelectedType(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {RULE_TYPES.map(rule => (
                <option key={rule.type} value={rule.type}>{rule.label}</option>
              ))}
            </select>
            <TextField
              size="small"
              label="Parameter (e.g., T12,T14)"
              value={param}
              onChange={e => setParam(e.target.value)}
            />
            <Button variant="outlined" onClick={addRule}>Add Rule</Button>
          </Box>
        </CardContent>
      </Card>

      {/* Current Rules Display */}
      <Card>
        <CardHeader
          title={`Current Rules (${rules.length})`}
          subheader="Rules that will be applied to your data"
        />
        <CardContent>
          {rules.length > 0 ? (
            <Box
              sx={{
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                padding: 2,
                borderRadius: 1,
                maxHeight: 300,
                overflow: 'auto'
              }}
            >
              <pre style={{ 
                margin: 0, 
                fontSize: '13px',
                color: '#212529',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                lineHeight: '1.4'
              }}>
                {JSON.stringify(rules, null, 2)}
              </pre>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              No rules defined yet. Use AI recommendations or manual builder to add rules.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Typography variant="body2" color="text.secondary">
          {rules.length} rules configured
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onNext}
          disabled={rules.length === 0}
        >
          Next: Prioritize and Export
        </Button>
      </Box>
    </Box>
  );
};
