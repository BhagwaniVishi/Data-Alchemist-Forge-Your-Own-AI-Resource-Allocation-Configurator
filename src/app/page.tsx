"use client";
import { useState } from "react";
import { WizardLayout } from "../components/wizard/WizardLayout";
import { FileUploadStep } from "../components/wizard/FileUploadStep";
import { useWizardStore } from "../store/wizardStore";
import { parseFiles } from "../utils/parseFiles";
import { DataReviewStep } from "../components/wizard/DataReviewStep";
import { RuleBuilderStep } from "../components/wizard/RuleBuilderStep";
import { PrioritizationStep } from "../components/wizard/PrioritizationStep";

export default function Home() {
  const step = useWizardStore((s) => s.step);
  const setStep = useWizardStore((s) => s.setStep);
  const setTables = useWizardStore((s) => s.setTables);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList) => {
    setLoading(true);
    setError(null);
    try {
      const tables = await parseFiles(files);
      setTables(tables);
      setStep(1);
    } catch {
      setError("Error processing files. Please verify the format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WizardLayout activeStep={step}>
      {step === 0 && (
        <FileUploadStep onFilesLoaded={handleFiles} />
      )}
      {step === 1 && (
        <DataReviewStep onNext={() => setStep(2)} />
      )}
      {step === 2 && (
        <RuleBuilderStep onNext={() => setStep(3)} />
      )}
      {step === 3 && (
        <PrioritizationStep onExport={() => console.log('Export completed')} />
      )}
      {loading && <div>Loading files...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </WizardLayout>
  );
}
