import { DataSource, DataSourceContext, DataSourceOption } from './types';
import { formFieldSource } from './formFieldSource';
import { globalDataSource } from './globalDataSource';

// ─── Registry ─────────────────────────────────────────────────────────────────
// To add a new data source:
//   1. Create src/datasources/yourSource.ts implementing DataSource
//   2. Import it here and add to this array
//   3. Done — no other changes needed anywhere

const DATA_SOURCES: DataSource[] = [
  formFieldSource,
  globalDataSource,
  // add new sources here
];

// ─── Get all options from all registered sources ──────────────────────────────

export function getAllDataSourceOptions(
  context: DataSourceContext
): DataSourceOption[] {
  return DATA_SOURCES.flatMap((source) => source.getOptions(context));
}

export type { DataSource, DataSourceContext, DataSourceOption };