import { ImportFormat } from './types/import.types';
import { runImport } from './import.helpers';

describe('runImport', () => {
  const format: ImportFormat<string> = { id: 'x', detect: json => 'x' in json, toDraft: json => String(json['x']) };

  it('creates the entity when nothing blocks', () => {
    expect(runImport('{"x":"ok"}', [format], [], draft => draft).entity).toBe('ok');
  });

  it('explains a missing entity even when no rule blocked', () => {
    const outcome = runImport('{"x":"ok"}', [format], [], () => null);
    expect(outcome.entity).toBeNull();
    expect(outcome.issues.map(issue => issue.message)).toEqual(['import.issue.incomplete']);
  });

  it('blocks malformed JSON and unknown formats', () => {
    expect(runImport('{ no', [format], [], draft => draft).issues[0].message).toBe('import.issue.malformedJson');
    expect(runImport('{"y":1}', [format], [], draft => draft).issues[0].message).toBe('import.issue.unknownFormat');
  });
});
