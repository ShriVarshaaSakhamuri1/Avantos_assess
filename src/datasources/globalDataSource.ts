import { DataSource, DataSourceContext, DataSourceOption } from './types';

// ─── Mock global data ─────────────────────────────────────────────────────────
// Replace with real API call when available.
// Adding new global fields = add entries here, zero other changes needed.

const GLOBAL_FIELDS = [
  { key: 'org_name', label: 'Organization Name' },
  { key: 'org_id', label: 'Organization ID' },
  { key: 'org_email', label: 'Organization Email' },
  { key: 'user_id', label: 'Current User ID' },
  { key: 'user_name', label: 'Current User Name' },
  { key: 'user_email', label: 'Current User Email' },
];

export const globalDataSource: DataSource = {
  id: 'global',

  getOptions(_context: DataSourceContext): DataSourceOption[] {
    return GLOBAL_FIELDS.map((field) => ({
      key: `global:${field.key}`,
      label: field.label,
      groupLabel: 'Global Data',
      toPrefillSource: () => ({
        sourceType: 'global' as const,
        key: field.key,
        label: `Global → ${field.label}`,
      }),
    }));
  },
};