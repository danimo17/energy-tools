import { ImportSpec } from '@app/core/import/types/import.types';
import { importInvoice } from './helpers/import-invoice';
import { Invoice, NewInvoice } from './types/invoices.types';

export const INVOICES_IMPORT: ImportSpec<Invoice> = {
  entityKey: 'entity.invoice',
  parse: importInvoice,
  identifierOf: (invoice: NewInvoice): string => invoice.number
};
