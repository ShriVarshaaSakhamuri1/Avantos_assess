import { create } from 'zustand';
import { PrefillMapping, PrefillSource } from '../types/graph';

// ─── Store Shape ──────────────────────────────────────────────────────────────

interface PrefillStore {
  // formId → fieldId → PrefillSource | null
  mappings: PrefillMapping;

  // Set a prefill source for a specific field on a specific form
  setMapping: (
    formId: string,
    fieldId: string,
    source: PrefillSource
  ) => void;

  // Clear the prefill source for a specific field
  clearMapping: (formId: string, fieldId: string) => void;

  // Get the prefill source for a specific field (undefined if not set)
  getMapping: (
    formId: string,
    fieldId: string
  ) => PrefillSource | null | undefined;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePrefillStore = create<PrefillStore>((set, get) => ({
  mappings: {},

  setMapping: (formId, fieldId, source) =>
    set((state) => ({
      mappings: {
        ...state.mappings,
        [formId]: {
          ...state.mappings[formId],
          [fieldId]: source,
        },
      },
    })),

  clearMapping: (formId, fieldId) =>
    set((state) => ({
      mappings: {
        ...state.mappings,
        [formId]: {
          ...state.mappings[formId],
          [fieldId]: null,
        },
      },
    })),

  getMapping: (formId, fieldId) => {
    return get().mappings[formId]?.[fieldId];
  },
}));