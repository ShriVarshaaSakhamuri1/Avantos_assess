import { DataSource, DataSourceContext, DataSourceOption } from './types';
import { getAncestorsSplit } from '../utils/dag';
import { FormNode } from '../types/graph';

function formNodeToOptions(
  form: FormNode,
  groupLabel: string
): DataSourceOption[] {
  return form.fields.map((field) => ({
    key: `form:${form.id}:${field.id}`,
    label: field.name,
    groupLabel,
    toPrefillSource: () => ({
      sourceType: 'form_field' as const,
      formId: form.id,
      fieldId: field.id,
      label: `${form.name} → ${field.name}`,
    }),
  }));
}

export const formFieldSource: DataSource = {
  id: 'form_field',

  getOptions({ targetFormId, graph }: DataSourceContext): DataSourceOption[] {
    const { direct, transitive } = getAncestorsSplit(targetFormId, graph);

    const directOptions = direct.flatMap((form) =>
      formNodeToOptions(form, `${form.name} (direct)`)
    );

    const transitiveOptions = transitive.flatMap((form) =>
      formNodeToOptions(form, `${form.name} (transitive)`)
    );

    return [...directOptions, ...transitiveOptions];
  },
};