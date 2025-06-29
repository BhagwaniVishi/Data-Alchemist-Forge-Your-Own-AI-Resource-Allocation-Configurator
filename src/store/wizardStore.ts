import { create } from "zustand";

export type TableType = "clients" | "workers" | "tasks";

export type RowData = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface RawTableData {
  type: TableType;
  name: string;
  data: RowData[];
  columns: string[];
}

interface WizardState {
  step: number;
  setStep: (step: number) => void;
  tables: RawTableData[];
  setTables: (tables: RawTableData[]) => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  step: 0,
  setStep: (step) => set({ step }),
  tables: [],
  setTables: (tables) => set({ tables }),
}));
