import { BlueprintGraph, PrefillSource } from '../types/graph';

// ─── Context passed to every data source ─────────────────────────────────────

export interface DataSourceContext {
  targetFormId: string;
  graph: BlueprintGraph;
}

// ─── A single selectable option in the prefill modal ─────────────────────────

export interface DataSourceOption {
  key: string;           // unique key across all sources
  label: string;         // displayed in the modal e.g. "Email"
  groupLabel: string;    // group header e.g. "Form A (direct)"
  toPrefillSource: () => PrefillSource; // converts to storable mapping
}

// ─── Interface every data source must implement ───────────────────────────────
// To add a new source: implement this interface, register in index.ts. Done.

export interface DataSource {
  id: string;
  getOptions(context: DataSourceContext): DataSourceOption[];
}