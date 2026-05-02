import { describe, it, expect } from 'vitest';
import { getAllDataSourceOptions } from './index';
import { formFieldSource } from './formFieldSource';
import { globalDataSource } from './globalDataSource';
import { BlueprintGraph } from '../types/graph';

const mockGraph: BlueprintGraph = {
  nodes: [
    {
      id: 'form-a', name: 'Form A', componentId: 'c1',
      fields: [
        { id: 'email', name: 'Email', type: 'short-text' },
        { id: 'name', name: 'Name', type: 'short-text' },
      ],
    },
    {
      id: 'form-b', name: 'Form B', componentId: 'c2',
      fields: [
        { id: 'email', name: 'Email', type: 'short-text' },
      ],
    },
    {
      id: 'form-d', name: 'Form D', componentId: 'c3',
      fields: [
        { id: 'email', name: 'Email', type: 'short-text' },
      ],
    },
  ],
  edges: [
    { source: 'form-a', target: 'form-b' },
    { source: 'form-b', target: 'form-d' },
  ],
};

const context = { targetFormId: 'form-d', graph: mockGraph };

describe('formFieldSource', () => {
  it('returns direct parent fields grouped as direct', () => {
    const options = formFieldSource.getOptions(context);
    const directGroup = options.filter((o) =>
      o.groupLabel.includes('direct')
    );
    expect(directGroup.length).toBeGreaterThan(0);
    expect(directGroup[0].groupLabel).toBe('Form B (direct)');
  });

  it('returns transitive ancestor fields grouped as transitive', () => {
    const options = formFieldSource.getOptions(context);
    const transitiveGroup = options.filter((o) =>
      o.groupLabel.includes('transitive')
    );
    expect(transitiveGroup.length).toBeGreaterThan(0);
    expect(transitiveGroup[0].groupLabel).toBe('Form A (transitive)');
  });

  it('toPrefillSource returns correct form_field shape', () => {
    const options = formFieldSource.getOptions(context);
    const source = options[0].toPrefillSource();
    expect(source.sourceType).toBe('form_field');
    if (source.sourceType === 'form_field') {
      expect(source.formId).toBeDefined();
      expect(source.fieldId).toBeDefined();
      expect(source.label).toContain('→');
    }
  });
});

describe('globalDataSource', () => {
  it('returns global options', () => {
    const options = globalDataSource.getOptions(context);
    expect(options.length).toBeGreaterThan(0);
  });

  it('all options have groupLabel of Global Data', () => {
    const options = globalDataSource.getOptions(context);
    options.forEach((o) => expect(o.groupLabel).toBe('Global Data'));
  });

  it('toPrefillSource returns correct global shape', () => {
    const options = globalDataSource.getOptions(context);
    const source = options[0].toPrefillSource();
    expect(source.sourceType).toBe('global');
    if (source.sourceType === 'global') {
      expect(source.key).toBeDefined();
      expect(source.label).toContain('Global →');
    }
  });
});

describe('getAllDataSourceOptions registry', () => {
  it('combines options from all sources', () => {
    const options = getAllDataSourceOptions(context);
    const hasFormField = options.some((o) => o.key.startsWith('form:'));
    const hasGlobal = options.some((o) => o.key.startsWith('global:'));
    expect(hasFormField).toBe(true);
    expect(hasGlobal).toBe(true);
  });

  it('all options have unique keys', () => {
    const options = getAllDataSourceOptions(context);
    const keys = options.map((o) => o.key);
    const uniqueKeys = new Set(keys);
    expect(keys.length).toBe(uniqueKeys.size);
  });
});