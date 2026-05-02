// ─── Field ────────────────────────────────────────────────────────────────────

export interface FormField {
  id: string;       // property key e.g. "email"
  name: string;     // display title e.g. "Email"
  type: string;     // avantos_type e.g. "short-text"
}

// ─── Form Node ────────────────────────────────────────────────────────────────

export interface FormNode {
  id: string;         // node id e.g. "form-bad163fd-..."
  name: string;       // e.g. "Form F"
  componentId: string; // links to forms[] entry
  fields: FormField[];
}

// ─── Graph Edge ───────────────────────────────────────────────────────────────

export interface GraphEdge {
  source: string;
  target: string;
}

// ─── Full Graph ───────────────────────────────────────────────────────────────

export interface BlueprintGraph {
  nodes: FormNode[];
  edges: GraphEdge[];
}

// ─── Prefill Source (discriminated union) ─────────────────────────────────────

export type PrefillSource =
  | {
      sourceType: 'form_field';
      formId: string;
      fieldId: string;
      label: string; // e.g. "Form A → Email"
    }
  | {
      sourceType: 'global';
      key: string;
      label: string; // e.g. "Global → Organization Name"
    };

// ─── Prefill Mapping ──────────────────────────────────────────────────────────

// formId → fieldId → PrefillSource | null
export type PrefillMapping = Record<string, Record<string, PrefillSource | null>>;