import { BlueprintGraph, FormField, PrefillSource } from '../../types/graph';
import { getAllDataSourceOptions, DataSourceOption } from '../../datasources';
import { getAncestorsSplit } from '../../utils/dag';

interface PrefillModalProps {
  targetFormId: string;
  field: FormField;
  graph: BlueprintGraph;
  onSelect: (source: PrefillSource) => void;
  onClose: () => void;
}

export function PrefillModal({
  targetFormId,
  field,
  graph,
  onSelect,
  onClose,
}: PrefillModalProps) {
  const options = getAllDataSourceOptions({ targetFormId, graph });

  // Group options by groupLabel
  const grouped = options.reduce<Record<string, DataSourceOption[]>>(
    (acc, option) => {
      if (!acc[option.groupLabel]) acc[option.groupLabel] = [];
      acc[option.groupLabel].push(option);
      return acc;
    },
    {}
  );

  function handleSelect(option: DataSourceOption) {
    onSelect(option.toPrefillSource());
    onClose();
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>Select Prefill Source</h3>
            <p style={styles.subtitle}>
              Field: <strong>{field.name}</strong>
            </p>
          </div>
          <button style={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        {/* Options */}
        <div style={styles.body}>
          {Object.keys(grouped).length === 0 && (
            <p style={styles.empty}>No prefill sources available.</p>
          )}
          {Object.entries(grouped).map(([groupLabel, groupOptions]) => (
            <div key={groupLabel} style={styles.group}>
              <div style={styles.groupLabel}>{groupLabel}</div>
              {groupOptions.map((option) => (
                <button
                  key={option.key}
                  style={styles.optionButton}
                  onClick={() => handleSelect(option)}
                >
                  <span style={styles.optionLabel}>{option.label}</span>
                  <span style={styles.optionType}>{option.groupLabel}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    width: '520px',
    maxHeight: '75vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #e5e7eb',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#111',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    color: '#6b7280',
  },
  body: {
    overflowY: 'auto',
    flex: 1,
    padding: '0.75rem 0',
  },
  empty: {
    padding: '1rem 1.5rem',
    color: '#9ca3af',
    fontSize: '0.875rem',
  },
  group: {
    marginBottom: '0.5rem',
  },
  groupLabel: {
    padding: '0.4rem 1.5rem',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #f3f4f6',
    borderBottom: '1px solid #f3f4f6',
  },
  optionButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.65rem 1.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    borderBottom: '1px solid #f9fafb',
  },
  optionLabel: {
    fontSize: '0.875rem',
    color: '#111',
    fontWeight: 500,
  },
  optionType: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
};