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
  updateTableData: (tableIndex: number, newData: RowData[]) => void;
  updateTableRow: (tableIndex: number, rowIndex: number, newRow: RowData) => void;
  applyDataModification: (modificationFn: (data: RowData[]) => RowData[]) => void;
}

export const useWizardStore = create<WizardState>((set, get) => ({
  step: 0,
  setStep: (step) => set({ step }),
  tables: [],
  setTables: (tables) => set({ tables }),
  
  updateTableData: (tableIndex: number, newData: RowData[]) => {
    const { tables } = get();
    if (tableIndex >= 0 && tableIndex < tables.length) {
      const updatedTables = [...tables];
      updatedTables[tableIndex] = {
        ...updatedTables[tableIndex],
        data: newData
      };
      set({ tables: updatedTables });
    }
  },
  
  updateTableRow: (tableIndex: number, rowIndex: number, newRow: RowData) => {
    const { tables } = get();
    if (tableIndex >= 0 && tableIndex < tables.length) {
      const updatedTables = [...tables];
      const table = updatedTables[tableIndex];
      if (rowIndex >= 0 && rowIndex < table.data.length) {
        table.data[rowIndex] = newRow;
        set({ tables: updatedTables });
      }
    }
  },
  
  applyDataModification: (modificationFn: (data: RowData[]) => RowData[]) => {
    const { tables } = get();
    if (tables.length > 0) {
      const updatedTables = [...tables];
      // Apply modification to the first table (you can modify this logic as needed)
      updatedTables[0] = {
        ...updatedTables[0],
        data: modificationFn([...updatedTables[0].data])
      };
      set({ tables: updatedTables });
    }
  }
}));
