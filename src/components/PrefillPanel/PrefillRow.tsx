import { FormField, PrefillSource } from '../../types/graph';

interface PrefillRowProps {
  field: FormField;
  mapping: PrefillSource | null;
  onClear: () => void;
  onConfigure: () => void;
}

export function PrefillRow({
  field,
  mapping,
  onClear,
  onConfigure,
}: PrefillRowProps) {
  const hasMapping = mapping !== null && mapping !== undefined;

  return (
    <div style={styles.row}>
      {/* Field name */}
      <div style={styles.colField}>
        <span style={styles.fieldName}>{field.name}</span>
        <span style={styles.fieldType}>{field.type}</span>
      </div>

      {/* Prefill source */}
      <div style={styles.colSource}>
        {hasMapping ? (
          <span style={styles.mappingLabel}>{mapping.label}</span>
        ) : (
          <button style={styles.configureButton} onClick={onConfigure}>
            + Configure
          </button>
        )}
      </div>

      {/* Clear button */}
      <div style={styles.colAction}>
        {hasMapping && (
          <button
            style={styles.clearButton}
            onClick={onClear}
            title="Clear prefill"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background 0.1s',
  },
  colField: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
  },
  colSource: {
    flex: 2,
  },
  colAction: {
    width: '40px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  fieldName: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#111',
  },
  fieldType: {
    fontSize: '0.7rem',
    color: '#9ca3af',
  },
  mappingLabel: {
    fontSize: '0.825rem',
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
    fontWeight: 500,
  },
  configureButton: {
    background: 'none',
    border: '1px dashed #d1d5db',
    borderRadius: '4px',
    padding: '0.25rem 0.6rem',
    fontSize: '0.8rem',
    color: '#6b7280',
    cursor: 'pointer',
  },
  clearButton: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: '0.25rem',
    borderRadius: '4px',
  },
};