import { Entity, NewEntity } from '@app/core/crud/types/crud.types';
import { ImportFormat, ImportRule } from '@app/core/import/types/import.types';

export type InvoiceFormatId = 'A' | 'B';

export interface InvoiceClient {
  name: string;
  vatNumber: string;
  address?: string;
}

export interface Invoice extends Entity {
  format: InvoiceFormatId;
  number: string;
  date: string;
  periodFrom: string;
  periodTo: string;
  client: InvoiceClient;
  base: number;
  tax: number;
  total: number;
}

export type NewInvoice = NewEntity<Invoice>;

export type InvoiceAmount = 'base' | 'tax' | 'total';

export type InvoiceDraft = Omit<NewInvoice, InvoiceAmount> & Record<InvoiceAmount, number | null>;

export interface DetailField {
  label: string;
  value: string;
}

export type InvoiceRule = ImportRule<InvoiceDraft>;

export type InvoiceFormat = ImportFormat<InvoiceDraft, InvoiceFormatId>;
