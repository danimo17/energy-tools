import { formatDecimal } from '@app/helpers/format';
import { computeTax, computeTotal, effectiveTax } from '../calculations';
import { InvoiceDraft, InvoiceRule } from '../../types/invoices.types';
import { ImportIssue } from '@app/core/import/types/import.types';

const VAT_PATTERN = /^[A-Z]\d{7}[A-Z0-9]$/;

const AMOUNT_TOLERANCE = 0.01;

const blocking = (message: string): ImportIssue[] => [{ severity: 'blocking', message }];

const informative = (message: string, params?: ImportIssue['params']): ImportIssue[] => [
  { severity: 'informative', message, params }
];

export const baseRequired: InvoiceRule = (draft: InvoiceDraft): ImportIssue[] =>
  draft.base === null ? blocking('invoices.issue.baseRequired') : [];

export const missingAddress: InvoiceRule = (draft: InvoiceDraft): ImportIssue[] =>
  draft.client.address?.trim() === '' ? informative('invoices.issue.missingAddress') : [];

export const emptyNumber: InvoiceRule = (draft: InvoiceDraft): ImportIssue[] =>
  draft.number.trim() === '' ? blocking('invoices.issue.emptyNumber') : [];

export const invertedRange: InvoiceRule = (draft: InvoiceDraft): ImportIssue[] =>
  draft.periodFrom !== '' && draft.periodTo !== '' && draft.periodFrom > draft.periodTo
    ? informative('invoices.issue.invertedRange', { from: draft.periodFrom, to: draft.periodTo })
    : [];

export const missingVat: InvoiceRule = (draft: InvoiceDraft): ImportIssue[] =>
  draft.client.vatNumber.trim() === '' ? informative('invoices.issue.missingVat') : [];

export const invalidVat: InvoiceRule = (draft: InvoiceDraft): ImportIssue[] =>
  draft.client.vatNumber.trim() === '' || VAT_PATTERN.test(draft.client.vatNumber)
    ? []
    : informative('invoices.issue.invalidVat', { vat: draft.client.vatNumber });

export const taxComputed: InvoiceRule = (draft: InvoiceDraft): ImportIssue[] =>
  draft.tax === null && draft.base !== null
    ? informative('invoices.issue.taxComputed', { tax: formatDecimal(computeTax(draft.base)) })
    : [];

export const totalComputed: InvoiceRule = (draft: InvoiceDraft): ImportIssue[] =>
  draft.total === null && draft.base !== null
    ? informative('invoices.issue.totalComputed', {
        total: formatDecimal(computeTotal(draft.base, effectiveTax(draft, draft.base)))
      })
    : [];

export const totalMismatch: InvoiceRule = (draft: InvoiceDraft): ImportIssue[] => {
  if (draft.base === null || draft.total === null) {
    return [];
  }
  const expected = computeTotal(draft.base, effectiveTax(draft, draft.base));
  return Math.abs(draft.total - expected) > AMOUNT_TOLERANCE
    ? informative('invoices.issue.totalMismatch', {
        total: formatDecimal(draft.total),
        expected: formatDecimal(expected)
      })
    : [];
};

export const INVOICE_RULES: InvoiceRule[] = [
  baseRequired,
  emptyNumber,
  missingAddress,
  invertedRange,
  missingVat,
  invalidVat,
  taxComputed,
  totalComputed,
  totalMismatch
];
