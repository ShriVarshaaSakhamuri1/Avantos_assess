# Journey Builder

A React + TypeScript app for configuring prefill mappings across a DAG of forms.

## Getting Started

### 1. Start the mock server
```bash
git clone https://github.com/mosaic-avantos/frontendchallengeserver
cd frontendchallengeserver
npm install
npm start
# Runs on http://localhost:3000
```

### 2. Start the app
```bash
cd avantos
npm install
npm run dev
# Runs on http://localhost:5173
```

### 3. Run tests
```bash
npm test
```

## Architecture

```
src/
  api/           # API layer — fetches and normalizes graph data
  types/         # TypeScript types (FormNode, PrefillSource, etc.)
  utils/dag.ts   # DAG traversal (getDirectDependencies, getAllAncestors)
  datasources/   # Plugin system for prefill data sources
  store/         # Zustand store for prefill mappings
  hooks/         # useGraph, usePrefill
  components/
    FormList/      # Sidebar list of forms
    FormDetails/   # Form detail view
    PrefillPanel/  # Prefill configuration panel
    PrefillModal/  # Source picker modal
```

## How to Add a New Data Source

1. Create `src/datasources/mySource.ts`:

```ts
import { DataSource, DataSourceContext, DataSourceOption } from './types';

export const mySource: DataSource = {
  id: 'my_source',
  getOptions(context: DataSourceContext): DataSourceOption[] {
    return [
      {
        key: 'my_source:field_1',
        label: 'My Field',
        groupLabel: 'My Source',
        toPrefillSource: () => ({
          sourceType: 'global',
          key: 'my_field_1',
          label: 'My Source → My Field',
        }),
      },
    ];
  },
};
```

2. Register it in `src/datasources/index.ts`:

```ts
import { mySource } from './mySource';

const DATA_SOURCES: DataSource[] = [
  formFieldSource,
  globalDataSource,
  mySource, // ← add this line
];
```

That's it. No other changes needed.

## DAG Traversal

Forms are connected in a Directed Acyclic Graph (DAG). The traversal logic in
`src/utils/dag.ts` uses BFS with a visited set to prevent infinite loops.

- `getDirectDependencies(formId, graph)` — immediate parent forms
- `getAllAncestors(formId, graph)` — all ancestors (direct + transitive)
- `getAncestorsSplit(formId, graph)` — returns `{ direct, transitive }` separately

This is used by the prefill modal to group sources clearly for the user.