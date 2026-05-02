import { FormNode } from '../../types/graph';
import { getDirectDependencies } from '../../utils/dag';

interface FormListProps {
  nodes: FormNode[];
  edges: Array<{ source: string; target: string }>;
  selectedFormId: string | null;
  onSelectForm: (formId: string) => void;
}

export function FormList({
  nodes,
  edges,
  selectedFormId,
  onSelectForm,
}: FormListProps) {
  const graph = { nodes, edges };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Forms</h2>
      <ul style={styles.list}>
        {nodes.map((node) => {
          const directDeps = getDirectDependencies(node.id, graph);
          const isSelected = node.id === selectedFormId;
          const depNames = directDeps.map((d) => d.name).join(', ');

          return (
            <li
              key={node.id}
              style={isSelected
                ? { ...styles.item, ...styles.itemSelected }
                : styles.item
              }
              onClick={() => onSelectForm(node.id)}
            >
              <div style={styles.formName}>{node.name}</div>
              <div style={styles.formMeta}>
                {node.fields.length} fields
              </div>
              {directDeps.length > 0 && (
                <div style={styles.deps}>
                  {"Depends on: " + depNames}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '260px',
    borderRight: '1px solid #ddd',
    padding: '1rem',
    backgroundColor: '#fff',
    overflowY: 'auto',
  },
  heading: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: '#333',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    padding: '0.75rem',
    marginBottom: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    backgroundColor: '#f9fafb',
  },
  itemSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  formName: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#111',
  },
  formMeta: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.2rem',
  },
  deps: {
    fontSize: '0.72rem',
    color: '#9ca3af',
    marginTop: '0.3rem',
  },
};