import { InvoiceFormat } from '../../types/invoices.types';
import { formatA } from './format-a';
import { formatB } from './format-b';

export const INVOICE_FORMATS: readonly InvoiceFormat[] = [formatA, formatB];
