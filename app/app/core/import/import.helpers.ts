import { isRecord, parseJson } from '@app/helpers/json';
import {
  ImportFormat,
  ImportIssue,
  ImportOutcome,
  ImportResult,
  ImportRule,
  ImportStatus,
  PendingStatus
} from './types/import.types';

const blocked = <E>(message: string): ImportOutcome<E> => ({
  entity: null,
  issues: [{ severity: 'blocking', message }]
});

export const runImport = <D, E>(
  text: string,
  formats: readonly ImportFormat<D>[],
  rules: readonly ImportRule<D>[],
  complete: (draft: D) => E | null
): ImportOutcome<E> => {
  const parsed = parseJson(text);
  if (!parsed.valid) {
    return blocked('import.issue.malformedJson');
  }
  if (!isRecord(parsed.value)) {
    return blocked('import.issue.unknownFormat');
  }
  const json = parsed.value;

  const format = formats.find((candidate: ImportFormat<D>): boolean => candidate.detect(json));
  if (!format) {
    return blocked('import.issue.unknownFormat');
  }

  const draft = format.toDraft(json);
  const issues = rules.flatMap((rule): ImportIssue[] => rule(draft));
  const hasBlocking = issues.some((issue: ImportIssue): boolean => issue.severity === 'blocking');
  const entity = hasBlocking ? null : complete(draft);
  return entity === null && !hasBlocking
    ? { entity, issues: [...issues, { severity: 'blocking', message: 'import.issue.incomplete' }] }
    : { entity, issues };
};

export const toImportResult = <E>(fileName: string, outcome: ImportOutcome<E>): ImportResult<E> => {
  const status: ImportStatus = outcome.entity === null ? 'blocked' : outcome.issues.length > 0 ? 'ok-warnings' : 'ok';
  return {
    fileName,
    status,
    issues: outcome.issues,
    operation: outcome.entity ? 'create' : null,
    entity: outcome.entity
  };
};

export const statusOf = <E>(result: ImportResult<E>): PendingStatus => {
  if (result.status === 'blocked') {
    return 'blocked';
  }
  const warnings = result.status === 'ok-warnings';
  if (result.operation === 'update') {
    return warnings ? 'updatedWarnings' : 'updated';
  }
  return warnings ? 'createdWarnings' : 'created';
};
