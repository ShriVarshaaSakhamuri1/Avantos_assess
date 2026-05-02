import { FormNode } from '../../types/graph';

interface FormDetailsProps {
  form: FormNode;
  onOpenPrefill: () => void;
}

export function FormDetails({ form, onOpenPrefill }: FormDetailsProps) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.formName}>{form.name}</h2>
          <p style={styles.formId}>ID: {form.id}</p>
        </div>
        <button style={styles.prefillButton} onClick={onOpenPrefill}>
          Configure Prefill
        </button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Fields ({form.fields.length})</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Field Name</th>
              <th style={styles.th}>Key</th>
              <th style={styles.th}>Type</th>
            </tr>
          </thead>
          <tbody>
            {form.fields.map((field) => (
              <tr key={field.id} style={styles.tr}>
                <td style={styles.td}>{field.name}</td>
                <td style={{ ...styles.td, ...styles.code }}>{field.id}</td>
                <td style={styles.td}>
                  <span style={styles.badge}>{field.type}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  formName: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111',
  },
  formId: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.25rem',
    fontFamily: 'monospace',
  },
  prefillButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.875rem',
  },
  section: {
    marginTop: '1rem',
  },
  sectionTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '0.75rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.5rem 0.75rem',
    backgroundColor: '#f3f4f6',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: 600,
    color: '#374151',
  },
  tr: {
    borderBottom: '1px solid #f3f4f6',
  },
  td: {
    padding: '0.6rem 0.75rem',
    color: '#374151',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    color: '#6b7280',
  },
  badge: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
};