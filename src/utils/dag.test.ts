import { describe, it, expect } from 'vitest';
import {
  getDirectDependencies,
  getAllAncestors,
  getTransitiveDependencies,
  getAncestorsSplit,
} from './dag';
import { BlueprintGraph } from '../types/graph';

// ─── Mock Graph ───────────────────────────────────────────────────────────────
//
//  Form A ──→ Form B ──→ Form D ──→ Form F
//        ↘                        ↗
//         Form C ──→ Form E ──────
//

const mockGraph: BlueprintGraph = {
  nodes: [
    { id: 'form-a', name: 'Form A', componentId: 'c1', fields: [] },
    { id: 'form-b', name: 'Form B', componentId: 'c2', fields: [] },
    { id: 'form-c', name: 'Form C', componentId: 'c3', fields: [] },
    { id: 'form-d', name: 'Form D', componentId: 'c4', fields: [] },
    { id: 'form-e', name: 'Form E', componentId: 'c5', fields: [] },
    { id: 'form-f', name: 'Form F', componentId: 'c6', fields: [] },
  ],
  edges: [
    { source: 'form-a', target: 'form-b' },
    { source: 'form-a', target: 'form-c' },
    { source: 'form-b', target: 'form-d' },
    { source: 'form-c', target: 'form-e' },
    { source: 'form-d', target: 'form-f' },
    { source: 'form-e', target: 'form-f' },
  ],
};

// ─── getDirectDependencies ────────────────────────────────────────────────────

describe('getDirectDependencies', () => {
  it('returns direct parents of Form D (only Form B)', () => {
    const result = getDirectDependencies('form-d', mockGraph);
    expect(result.map((n) => n.id)).toEqual(['form-b']);
  });

  it('returns direct parents of Form F (Form D and Form E)', () => {
    const result = getDirectDependencies('form-f', mockGraph);
    expect(result.map((n) => n.id)).toContain('form-d');
    expect(result.map((n) => n.id)).toContain('form-e');
    expect(result).toHaveLength(2);
  });

  it('returns empty array for root node (Form A has no parents)', () => {
    const result = getDirectDependencies('form-a', mockGraph);
    expect(result).toHaveLength(0);
  });
});

// ─── getAllAncestors ──────────────────────────────────────────────────────────

describe('getAllAncestors', () => {
  it('returns all ancestors of Form D (Form B and Form A)', () => {
    const result = getAllAncestors('form-d', mockGraph);
    const ids = result.map((n) => n.id);
    expect(ids).toContain('form-a');
    expect(ids).toContain('form-b');
    expect(result).toHaveLength(2);
  });

  it('returns all ancestors of Form F (Form D, E, B, C, A)', () => {
    const result = getAllAncestors('form-f', mockGraph);
    const ids = result.map((n) => n.id);
    expect(ids).toContain('form-a');
    expect(ids).toContain('form-b');
    expect(ids).toContain('form-c');
    expect(ids).toContain('form-d');
    expect(ids).toContain('form-e');
    expect(result).toHaveLength(5);
  });

  it('returns empty array for root node', () => {
    const result = getAllAncestors('form-a', mockGraph);
    expect(result).toHaveLength(0);
  });

  it('does not include the form itself in ancestors', () => {
    const result = getAllAncestors('form-d', mockGraph);
    const ids = result.map((n) => n.id);
    expect(ids).not.toContain('form-d');
  });

  it('never visits the same node twice (no duplicates)', () => {
    const result = getAllAncestors('form-f', mockGraph);
    const ids = result.map((n) => n.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });
});

// ─── getTransitiveDependencies ────────────────────────────────────────────────

describe('getTransitiveDependencies', () => {
  it('returns only transitive ancestors of Form D (Form A, not Form B)', () => {
    const result = getTransitiveDependencies('form-d', mockGraph);
    const ids = result.map((n) => n.id);
    expect(ids).toContain('form-a');
    expect(ids).not.toContain('form-b'); // Form B is direct, not transitive
  });
});

// ─── getAncestorsSplit ────────────────────────────────────────────────────────

describe('getAncestorsSplit', () => {
  it('correctly splits direct and transitive for Form D', () => {
    const { direct, transitive } = getAncestorsSplit('form-d', mockGraph);
    expect(direct.map((n) => n.id)).toEqual(['form-b']);
    expect(transitive.map((n) => n.id)).toContain('form-a');
  });

  it('correctly splits direct and transitive for Form F', () => {
    const { direct, transitive } = getAncestorsSplit('form-f', mockGraph);
    const directIds = direct.map((n) => n.id);
    const transitiveIds = transitive.map((n) => n.id);

    expect(directIds).toContain('form-d');
    expect(directIds).toContain('form-e');
    expect(transitiveIds).toContain('form-a');
    expect(transitiveIds).toContain('form-b');
    expect(transitiveIds).toContain('form-c');
  });

  it('returns empty arrays for root node', () => {
    const { direct, transitive } = getAncestorsSplit('form-a', mockGraph);
    expect(direct).toHaveLength(0);
    expect(transitive).toHaveLength(0);
  });
});