import { RawTableData } from '../store/wizardStore';
import { ValidationError } from '../components/wizard/ValidatorPanel';

// Minimum rules: missing column, duplicate ID, out-of-range values, empty fields, incorrect type, etc.

const idColumns: Record<string, string> = {
  clients: 'ClientID',
  workers: 'WorkerID',
  tasks: 'TaskID',
};

const requiredFields: Record<string, string[]> = {
  clients: ['ClientID', 'ClientName'],
  workers: ['WorkerID', 'WorkerName'],
  tasks: ['TaskID', 'TaskName'],
};

export function validateTables(tables: RawTableData[]): ValidationError[] {
  const errors: ValidationError[] = [];

  // Build lookup sets for cross-entity validation
  const workerSkills = new Set(
    (tables.find(t => t.type === 'workers')?.data || [])
      .flatMap(row => (typeof row['Skills'] === 'string' ? row['Skills'].split(',').map((s: string) => s.trim()) : []))
  );

  tables.forEach((table) => {
    const idCol = idColumns[table.type] || 'id';
    if (!table.data || table.data.length === 0) return;

    // 1. Check for required ID column
    const firstRow = table.data[0];
    if (!firstRow || !(idCol in firstRow)) {
      errors.push({
        table: table.type,
        row: 0,
        column: idCol,
        message: `Missing required column: ${idCol}. Please add this column to your data file.`,
        severity: 'error'
      });
      return;
    }
    // 2. Duplicate IDs
    const ids = new Set<string>();
    table.data.forEach((row: Record<string, unknown>, i: number) => {
      const id = row[idCol];
      if (typeof id === 'string' || typeof id === 'number') {
        const idStr = String(id);
        if (ids.has(idStr)) {
          errors.push({
            table: table.type,
            row: i,
            column: idCol,
            message: `Duplicate ${idCol}: ${idStr}. Each row must have a unique ID.`,
            severity: 'error'
          });
        } else {
          ids.add(idStr);
        }
      }
    });
    // 3. Check for empty required fields
    const reqFields = requiredFields[table.type] || [];
    reqFields.forEach(field => {
      table.data.forEach((row: Record<string, unknown>, i: number) => {
        const value = row[field];
        if (value === null || value === undefined || value === '') {
          errors.push({
            table: table.type,
            row: i,
            column: field,
            message: `Missing value for required field: ${field}. Please fill in this field.`,
            severity: 'warning'
          });
        }
      });
    });
    // 4. Advanced: Cross-entity and JSON validation
    if (table.type === 'clients') {
      // No per-row checks needed for clients at this stage
    }
    if (table.type === 'tasks') {
      table.data.forEach((row: Record<string, unknown>, i: number) => {
        // RequiredSkills must exist in workers' skills
        if (row['RequiredSkills']) {
          const skills = String(row['RequiredSkills']).split(',').map(s => s.trim());
          skills.forEach(skill => {
            if (skill && !workerSkills.has(skill)) {
              errors.push({
                table: table.type,
                row: i,
                column: 'RequiredSkills',
                message: `Required skill '${skill}' is not covered by any worker. Please check your workers' skills.`,
                severity: 'error'
              });
            }
          });
        }
      });
    }
    // 5. Validate numeric fields
    const numericFields = ['priority', 'duration', 'cost'];
    numericFields.forEach(field => {
      table.data.forEach((row: Record<string, unknown>, i: number) => {
        const value = row[field];
        if (value !== null && value !== undefined && value !== '') {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            errors.push({
              table: table.type,
              row: i,
              column: field,
              message: `Invalid numeric value for ${field}: ${value}`,
              severity: 'error'
            });
          }
        }
      });
    });

    // 6. Validate date fields
    const dateFields = ['start_date', 'end_date', 'deadline'];
    dateFields.forEach(field => {
      table.data.forEach((row: Record<string, unknown>, i: number) => {
        const value = row[field];
        if (value !== null && value !== undefined && value !== '') {
          const dateValue = new Date(String(value));
          if (isNaN(dateValue.getTime())) {
            errors.push({
              table: table.type,
              row: i,
              column: field,
              message: `Invalid date format for ${field}: ${value}`,
              severity: 'error'
            });
          }
        }
      });
    });

    // 7. Check for reasonable string lengths
    const stringFields = ['name', 'description', 'notes'];
    stringFields.forEach(field => {
      table.data.forEach((row: Record<string, unknown>, i: number) => {
        const value = row[field];
        if (typeof value === 'string' && value.length > 500) {
          errors.push({
            table: table.type,
            row: i,
            column: field,
            message: `Text too long for ${field}: ${value.length} characters`,
            severity: 'warning'
          });
        }
      });
    });
  });

  return errors;
}
