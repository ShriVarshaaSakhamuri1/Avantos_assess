import { BlueprintGraph, FormNode } from '../types/graph';

// ─── Get Direct Dependencies ──────────────────────────────────────────────────
// Returns immediate parent nodes (one level up) of a given form

export function getDirectDependencies(
  formId: string,
  graph: BlueprintGraph
): FormNode[] {
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

  return graph.edges
    .filter((edge) => edge.target === formId)
    .map((edge) => nodeMap.get(edge.source))
    .filter((node): node is FormNode => node !== undefined);
}

// ─── Get All Ancestors ────────────────────────────────────────────────────────
// Returns ALL ancestor nodes (direct + transitive) using BFS
// Uses a visited set to prevent infinite loops

export function getAllAncestors(
  formId: string,
  graph: BlueprintGraph
): FormNode[] {
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  const visited = new Set<string>();
  const queue: string[] = [formId];
  const ancestors: FormNode[] = [];

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    // Find all parents of current node
    const parentIds = graph.edges
      .filter((edge) => edge.target === currentId)
      .map((edge) => edge.source);

    for (const parentId of parentIds) {
      if (!visited.has(parentId)) {
        visited.add(parentId);
        const parentNode = nodeMap.get(parentId);
        if (parentNode) {
          ancestors.push(parentNode);
          queue.push(parentId); // continue traversing upward
        }
      }
    }
  }

  return ancestors;
}

// ─── Get Transitive-Only Dependencies ────────────────────────────────────────
// Returns ancestors that are NOT direct parents (indirect only)

export function getTransitiveDependencies(
  formId: string,
  graph: BlueprintGraph
): FormNode[] {
  const direct = new Set(
    getDirectDependencies(formId, graph).map((n) => n.id)
  );

  return getAllAncestors(formId, graph).filter(
    (node) => !direct.has(node.id)
  );
}

// ─── Get Ancestors Split by Type ─────────────────────────────────────────────
// Returns direct and transitive ancestors separately
// This is what the prefill modal needs

export function getAncestorsSplit(
  formId: string,
  graph: BlueprintGraph
): { direct: FormNode[]; transitive: FormNode[] } {
  const direct = getDirectDependencies(formId, graph);
  const directIds = new Set(direct.map((n) => n.id));
  const all = getAllAncestors(formId, graph);
  const transitive = all.filter((n) => !directIds.has(n.id));

  return { direct, transitive };
}