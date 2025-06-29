import Papa from "papaparse";
import * as XLSX from "xlsx";
import { RawTableData, TableType, RowData } from "../store/wizardStore";

const TABLE_KEYWORDS: Record<TableType, string[]> = {
  clients: ["client", "cliente", "clientes"],
  workers: ["worker", "trabajador", "empleado", "workers"],
  tasks: ["task", "tarea", "tasks", "tareas"],
};

function guessTableType(filename: string): TableType | null {
  const lower = filename.toLowerCase();
  for (const [type, keywords] of Object.entries(TABLE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return type as TableType;
  }
  return null;
}

export async function parseFiles(files: FileList): Promise<RawTableData[]> {
  const results: RawTableData[] = [];
  for (const file of Array.from(files)) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    let rows: RowData[] = [];
    let columns: string[] = [];
    if (ext === "csv") {
      const text = await file.text();
      const parsed = Papa.parse<RowData>(text, {
        header: true,
        skipEmptyLines: true,
      });
      rows = parsed.data as RowData[];
      columns = parsed.meta.fields || [];
    } else if (ext === "xlsx") {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json<RowData>(sheet, { defval: "" });
      columns = Object.keys(rows[0] || {});
    }
    const type = guessTableType(file.name) || "tasks";
    results.push({ type, name: file.name, data: rows, columns });
  }
  return results;
}
