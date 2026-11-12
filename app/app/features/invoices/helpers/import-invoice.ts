import { runImport } from '@app/core/import/import.helpers';
import { ImportOutcome } from '@app/core/import/types/import.types';
import { InvoiceDraft, NewInvoice } from '../types/invoices.types';
import { completeInvoice } from './calculations';
import { INVOICE_FORMATS } from './formats';
import { INVOICE_RULES } from './rules/rules';

export const importInvoice = (text: string): ImportOutcome<NewInvoice> =>
  runImport(text, INVOICE_FORMATS, INVOICE_RULES, (draft: InvoiceDraft): NewInvoice | null =>
    draft.base === null ? null : completeInvoice(draft, draft.base)
  );
