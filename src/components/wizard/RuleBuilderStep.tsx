import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

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
}

export const RuleBuilderStep: React.FC<RuleBuilderStepProps> = ({ onNext }) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedType, setSelectedType] = useState<string>('co-run');
  const [param, setParam] = useState('');

  const addRule = () => {
    if (!param) return;
    setRules([...rules, { type: selectedType, params: { value: param } }]);
    setParam('');
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h6">Define Business Rules</Typography>
      <Box display="flex" gap={2} alignItems="center">
        <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
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
      <Box mt={3}>
        <Typography variant="subtitle2">Current Rules:</Typography>
        <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 4 }}>{JSON.stringify(rules, null, 2)}</pre>
      </Box>
      <Button variant="contained" color="primary" onClick={onNext} sx={{ alignSelf: 'flex-end' }}>
        Next: Prioritize and Export
      </Button>
    </Box>
  );
};
