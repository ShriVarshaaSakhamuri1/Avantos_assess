import axios from 'axios';
import { BlueprintGraph, FormField, FormNode } from '../types/graph';

const BASE_URL = 'http://localhost:3000';

// ─── Raw API shapes ───────────────────────────────────────────────────────────

interface RawFieldSchema {
  avantos_type?: string;
  title?: string;
  type?: string;
}

interface RawForm {
  id: string;
  name: string;
  field_schema: {
    properties?: Record<string, RawFieldSchema>;
  };
}

interface RawNodeData {
  name?: string;
  component_id?: string;
}

interface RawNode {
  id: string;
  data?: RawNodeData;
}

interface RawEdge {
  source: string;
  target: string;
}

interface RawGraph {
  nodes?: RawNode[];
  edges?: RawEdge[];
  forms?: RawForm[];
}

// ─── Normalizers ─────────────────────────────────────────────────────────────

function normalizeFields(
  properties: Record<string, RawFieldSchema>
): FormField[] {
  return Object.entries(properties)
    .filter(([, schema]) => schema.avantos_type !== 'button') // skip UI-only fields
    .map(([key, schema]) => ({
      id: key,
      name: schema.title ?? key,
      type: schema.avantos_type ?? schema.type ?? 'text',
    }));
}

function normalizeGraph(raw: RawGraph): BlueprintGraph {
  // Build a map of formId → fields for quick lookup
  const formFieldsMap = new Map<string, FormField[]>();

  (raw.forms ?? []).forEach((form) => {
    const properties = form.field_schema?.properties ?? {};
    formFieldsMap.set(form.id, normalizeFields(properties));
  });

  const nodes: FormNode[] = (raw.nodes ?? []).map((rawNode) => {
    const componentId = rawNode.data?.component_id ?? '';
    const fields = formFieldsMap.get(componentId) ?? [];

    return {
      id: rawNode.id,
      name: rawNode.data?.name ?? rawNode.id,
      componentId,
      fields,
    };
  });

  const edges = (raw.edges ?? []).map((e) => ({
    source: e.source,
    target: e.target,
  }));

  return { nodes, edges };
}

// ─── Public API function ──────────────────────────────────────────────────────

export async function fetchBlueprintGraph(
  tenantId: string,
  blueprintId: string
): Promise<BlueprintGraph> {
  const url = `${BASE_URL}/api/v1/${tenantId}/actions/blueprints/${blueprintId}/graph`;
  const { data } = await axios.get<RawGraph>(url);
  return normalizeGraph(data);
}