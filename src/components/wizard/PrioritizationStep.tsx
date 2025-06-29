import React, { useState } from 'react';
import { useWizardStore } from '../../store/wizardStore';
import * as XLSX from 'xlsx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';

interface CriteriaWeight {
  label: string;
  key: string;
  value: number;
}

const CRITERIA: CriteriaWeight[] = [
  { label: 'Cost', key: 'cost', value: 50 },
  { label: 'Workload', key: 'workload', value: 50 },
  { label: 'Preference', key: 'preference', value: 50 },
  { label: 'Phase Balance', key: 'phaseBalance', value: 50 },
];


interface PrioritizationStepProps {
  onExport: () => void;
}


export const PrioritizationStep: React.FC<PrioritizationStepProps> = ({ onExport }) => {
  const [criteria, setCriteria] = useState(CRITERIA);
  const tables = useWizardStore((s) => s.tables);

  const handleChange = (idx: number, value: number) => {
    setCriteria((prev) => prev.map((c, i) => i === idx ? { ...c, value } : c));
  };

  // Export clean data and rules.json
  const handleExport = () => {
    // Export data to XLSX
    tables.forEach((table) => {
      const ws = XLSX.utils.json_to_sheet(table.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, table.type);
      XLSX.writeFile(wb, `${table.type}.xlsx`);
    });
    // Export rules and criteria to rules.json
    const rules = { criteria, /* real rules can be added here */ };
    const blob = new Blob([JSON.stringify(rules, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rules.json';
    a.click();
    URL.revokeObjectURL(url);
    if (onExport) onExport();
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h6">Prioritize criteria and export</Typography>
      {criteria.map((c, idx) => (
        <Box key={c.key}>
          <Typography gutterBottom>{c.label}</Typography>
          <Slider
            value={c.value}
            min={0}
            max={100}
            step={1}
            onChange={(_, v) => handleChange(idx, v as number)}
            valueLabelDisplay="auto"
          />
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleExport} sx={{ alignSelf: 'flex-end' }}>
        Export Clean Data and rules.json
      </Button>
    </Box>
  );
};
