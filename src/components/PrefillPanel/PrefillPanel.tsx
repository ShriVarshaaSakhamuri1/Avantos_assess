import { FormNode } from '../../types/graph';
import { usePrefill } from '../../hooks/usePrefill';
import { PrefillRow } from './PrefillRow';

interface PrefillPanelProps {
  form: FormNode;
  onClose: () => void;
  onOpenModal: (fieldId: string) => void;
}

export function PrefillPanel({
  form,
  onClose,
  onOpenModal,
}: PrefillPanelProps) {
  const { getMappingForField, clearPrefill } = usePrefill(form.id);

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Prefill Configuration</h2>
            <p style={styles.subtitle}>{form.name}</p>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Field rows */}
        <div style={styles.body}>
          <div style={styles.tableHeader}>
            <span style={styles.colField}>Field</span>
            <span style={styles.colSource}>Prefill Source</span>
            <span style={styles.colAction} />
          </div>

          {form.fields.map((field) => {
            const mapping = getMappingForField(field.id);
            return (
              <PrefillRow
                key={field.id}
                field={field}
                mapping={mapping ?? null}
                onClear={() => clearPrefill(field.id)}
                onConfigure={() => onOpenModal(field.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    width: '680px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #e5e7eb',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#111',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#6b7280',
    marginTop: '0.2rem',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0.25rem',
  },
  body: {
    overflowY: 'auto',
    flex: 1,
    padding: '0.5rem 0',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1.5rem',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  colField: { flex: 1 },
  colSource: { flex: 2 },
  colAction: { width: '40px' },
};