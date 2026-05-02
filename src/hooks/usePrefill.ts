import { usePrefillStore } from '../store/prefillStore';
import { PrefillSource } from '../types/graph';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePrefill(formId: string) {
  const { mappings, setMapping, clearMapping } = usePrefillStore();

  // All mappings for this specific form
  const formMappings = mappings[formId] ?? {};

  function getMappingForField(
    fieldId: string
  ): PrefillSource | null | undefined {
    return formMappings[fieldId];
  }

  function setPrefill(fieldId: string, source: PrefillSource) {
    setMapping(formId, fieldId, source);
  }

  function clearPrefill(fieldId: string) {
    clearMapping(formId, fieldId);
  }

  return {
    formMappings,
    getMappingForField,
    setPrefill,
    clearPrefill,
  };
}