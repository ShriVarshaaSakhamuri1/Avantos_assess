import { useEffect, useState } from 'react';
import { fetchBlueprintGraph } from '../api/graph';
import { BlueprintGraph } from '../types/graph';

interface UseGraphState {
  graph: BlueprintGraph | null;
  loading: boolean;
  error: string | null;
}

export function useGraph(
  tenantId: string,
  blueprintId: string
): UseGraphState {
  const [graph, setGraph] = useState<BlueprintGraph | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGraph() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBlueprintGraph(tenantId, blueprintId);
        if (!cancelled) setGraph(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch graph'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadGraph();
    return () => { cancelled = true; };
  }, [tenantId, blueprintId]);

  return { graph, loading, error };
}