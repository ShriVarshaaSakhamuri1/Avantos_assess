import { describe, it, expect, beforeEach } from 'vitest';
import { usePrefillStore } from './prefillStore';
import { PrefillSource } from '../types/graph';

// Reset store between tests
beforeEach(() => {
  usePrefillStore.setState({ mappings: {} });
});

// ─── setMapping ───────────────────────────────────────────────────────────────

describe('setMapping', () => {
  it('adds a form_field prefill mapping', () => {
    const source: PrefillSource = {
      sourceType: 'form_field',
      formId: 'form-a',
      fieldId: 'email',
      label: 'Form A → Email',
    };

    usePrefillStore.getState().setMapping('form-d', 'email', source);

    const result = usePrefillStore.getState().mappings['form-d']['email'];
    expect(result).toEqual(source);
  });

  it('adds a global prefill mapping', () => {
    const source: PrefillSource = {
      sourceType: 'global',
      key: 'org_name',
      label: 'Global → Organization Name',
    };

    usePrefillStore.getState().setMapping('form-d', 'name', source);

    const result = usePrefillStore.getState().mappings['form-d']['name'];
    expect(result).toEqual(source);
  });

  it('overwrites an existing mapping', () => {
    const sourceA: PrefillSource = {
      sourceType: 'form_field',
      formId: 'form-a',
      fieldId: 'email',
      label: 'Form A → Email',
    };

    const sourceB: PrefillSource = {
      sourceType: 'form_field',
      formId: 'form-b',
      fieldId: 'email',
      label: 'Form B → Email',
    };

    usePrefillStore.getState().setMapping('form-d', 'email', sourceA);
    usePrefillStore.getState().setMapping('form-d', 'email', sourceB);

    const result = usePrefillStore.getState().mappings['form-d']['email'];
    expect(result).toEqual(sourceB);
  });

  it('can set mappings for multiple fields independently', () => {
    const emailSource: PrefillSource = {
      sourceType: 'form_field',
      formId: 'form-a',
      fieldId: 'email',
      label: 'Form A → Email',
    };

    const nameSource: PrefillSource = {
      sourceType: 'form_field',
      formId: 'form-a',
      fieldId: 'name',
      label: 'Form A → Name',
    };

    usePrefillStore.getState().setMapping('form-d', 'email', emailSource);
    usePrefillStore.getState().setMapping('form-d', 'name', nameSource);

    const state = usePrefillStore.getState().mappings['form-d'];
    expect(state['email']).toEqual(emailSource);
    expect(state['name']).toEqual(nameSource);
  });
});

// ─── clearMapping ─────────────────────────────────────────────────────────────

describe('clearMapping', () => {
  it('sets a mapping to null (not undefined)', () => {
    const source: PrefillSource = {
      sourceType: 'form_field',
      formId: 'form-a',
      fieldId: 'email',
      label: 'Form A → Email',
    };

    usePrefillStore.getState().setMapping('form-d', 'email', source);
    usePrefillStore.getState().clearMapping('form-d', 'email');

    const result = usePrefillStore.getState().mappings['form-d']['email'];
    expect(result).toBeNull();
  });

  it('does not affect other fields when clearing one', () => {
    const source: PrefillSource = {
      sourceType: 'form_field',
      formId: 'form-a',
      fieldId: 'email',
      label: 'Form A → Email',
    };

    usePrefillStore.getState().setMapping('form-d', 'email', source);
    usePrefillStore.getState().setMapping('form-d', 'name', source);
    usePrefillStore.getState().clearMapping('form-d', 'email');

    expect(usePrefillStore.getState().mappings['form-d']['email']).toBeNull();
    expect(usePrefillStore.getState().mappings['form-d']['name']).toEqual(source);
  });
});

// ─── getMapping ───────────────────────────────────────────────────────────────

describe('getMapping', () => {
  it('returns undefined for a field with no mapping set', () => {
    const result = usePrefillStore.getState().getMapping('form-d', 'email');
    expect(result).toBeUndefined();
  });

  it('returns the source after setMapping', () => {
    const source: PrefillSource = {
      sourceType: 'global',
      key: 'org_name',
      label: 'Global → Organization Name',
    };

    usePrefillStore.getState().setMapping('form-d', 'name', source);
    const result = usePrefillStore.getState().getMapping('form-d', 'name');
    expect(result).toEqual(source);
  });

  it('returns null after clearMapping', () => {
    const source: PrefillSource = {
      sourceType: 'form_field',
      formId: 'form-a',
      fieldId: 'email',
      label: 'Form A → Email',
    };

    usePrefillStore.getState().setMapping('form-d', 'email', source);
    usePrefillStore.getState().clearMapping('form-d', 'email');

    const result = usePrefillStore.getState().getMapping('form-d', 'email');
    expect(result).toBeNull();
  });
});