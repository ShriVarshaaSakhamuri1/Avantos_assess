import { useState } from 'react';
import { useGraph } from './hooks/useGraph';
import { FormList } from './components/FormList/FormList';
import { FormDetails } from './components/FormDetails/FormDetails';
import { PrefillPanel } from './components/PrefillPanel/PrefillPanel';
import { PrefillModal } from './components/PrefillModal/PrefillModal';
import { usePrefill } from './hooks/usePrefill';
import { FormNode } from './types/graph';

const TENANT_ID = '1';
const BLUEPRINT_ID = 'bp_01jk766tckfwx84xjcxazggzyc';

function PrefillFlow({
  form,
  graph,
  onClose,
}: {
  form: FormNode;
  graph: ReturnType<typeof useGraph>['graph'];
  onClose: () => void;
}) {
  const [configuringFieldId, setConfiguringFieldId] = useState<string | null>(null);
  const { setPrefill } = usePrefill(form.id);

  const configuringField = form.fields.find((f) => f.id === configuringFieldId) ?? null;

  return (
    <>
      <PrefillPanel
        form={form}
        onClose={onClose}
        onOpenModal={(fieldId) => setConfiguringFieldId(fieldId)}
      />
      {configuringField && graph && (
        <PrefillModal
          targetFormId={form.id}
          field={configuringField}
          graph={graph}
          onSelect={(source) => {
            setPrefill(configuringField.id, source);
            setConfiguringFieldId(null);
          }}
          onClose={() => setConfiguringFieldId(null)}
        />
      )}
    </>
  );
}

function App() {
  const { graph, loading, error } = useGraph(TENANT_ID, BLUEPRINT_ID);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [prefillFormId, setPrefillFormId] = useState<string | null>(null);

  if (loading) return <p style={{ padding: '2rem' }}>Loading graph...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>Error: {error}</p>;
  if (!graph) return null;

  const selectedForm = graph.nodes.find((n) => n.id === selectedFormId) ?? null;
  const prefillForm = graph.nodes.find((n) => n.id === prefillFormId) ?? null;

  return (
    <div style={styles.app}>
      <FormList
        nodes={graph.nodes}
        edges={graph.edges}
        selectedFormId={selectedFormId}
        onSelectForm={setSelectedFormId}
      />

      <main style={styles.main}>
        {selectedForm ? (
          <FormDetails
            form={selectedForm}
            onOpenPrefill={() => setPrefillFormId(selectedForm.id)}
          />
        ) : (
          <div style={styles.empty}>
            <p>Select a form to view its details</p>
          </div>
        )}
      </main>

      {prefillForm && (
        <PrefillFlow
          form={prefillForm}
          graph={graph}
          onClose={() => setPrefillFormId(null)}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f9fafb',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#9ca3af',
    fontSize: '1rem',
  },
};

export default App;