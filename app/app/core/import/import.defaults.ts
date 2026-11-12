import { PendingStatus } from './types/import.types';

export const STATUS_VIEW: Record<PendingStatus, { label: string; className: string }> = {
  pending: { label: 'common.status.pending', className: 'text-contrast-60' },
  uploading: { label: 'common.status.uploading', className: 'text-info' },
  created: { label: 'common.status.created', className: 'text-success' },
  createdWarnings: { label: 'common.status.createdWarnings', className: 'text-warning' },
  updated: { label: 'common.status.updated', className: 'text-info' },
  updatedWarnings: { label: 'common.status.updatedWarnings', className: 'text-warning' },
  blocked: { label: 'common.status.blocked', className: 'text-error' }
};

export const CLOSE_ID = 'close';
