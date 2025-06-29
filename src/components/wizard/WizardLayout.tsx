import React from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';

const steps = [
  'Upload Files',
  'Review and Edit',
  'Define Rules',
  'Prioritize and Export',
];

interface WizardLayoutProps {
  activeStep: number;
  children: React.ReactNode;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({ activeStep, children }) => {
  return (
    <Box>
      <Box sx={{ width: '100%', p: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
};
