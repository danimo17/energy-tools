import { Entity, NewEntity } from '@app/core/crud/types/crud.types';
import { JsonRecord } from '@app/helpers/json.types';
import { TranslateParams } from '../../i18n/types/i18n.types';

export type IssueSeverity = 'blocking' | 'informative';

export interface ImportIssue {
  severity: IssueSeverity;
  message: string;
  params?: TranslateParams;
}

export type ImportStatus = 'ok' | 'ok-warnings' | 'blocked';

export type ImportOperation = 'create' | 'update';

export interface ImportOutcome<E> {
  entity: E | null;
  issues: ImportIssue[];
}

export interface ImportResult<E> extends ImportOutcome<E> {
  fileName: string;
  status: ImportStatus;
  operation: ImportOperation | null;
}

export type PendingStatus =
  | 'pending'
  | 'uploading'
  | 'created'
  | 'createdWarnings'
  | 'updated'
  | 'updatedWarnings'
  | 'blocked';

export interface PendingFile {
  id: number;
  file: File;
  status: PendingStatus;
}

export type ImportRule<D> = (draft: D) => ImportIssue[];

export interface ImportFormat<D, Id extends string = string> {
  id: Id;
  detect: (json: JsonRecord) => boolean;
  toDraft: (json: JsonRecord) => D;
}

export interface ImportSpec<T extends Entity> {
  entityKey: string;
  parse: (text: string) => ImportOutcome<NewEntity<T>>;
  identifierOf: (entity: NewEntity<T>) => string;
}
