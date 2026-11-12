import { round2 } from '@app/helpers/math';
import { InvoiceDraft, NewInvoice } from '../types/invoices.types';

const TAX_RATE = 0.21;

export const computeTax = (base: number): number => round2(base * TAX_RATE);

export const computeTotal = (base: number, tax: number): number => round2(base + tax);

export const effectiveTax = (draft: InvoiceDraft, base: number): number => draft.tax ?? computeTax(base);

export const completeInvoice = (draft: InvoiceDraft, base: number): NewInvoice => {
  const tax = effectiveTax(draft, base);
  return {
    ...draft,
    client: { ...draft.client, address: draft.client.address || undefined },
    base,
    tax,
    total: draft.total ?? computeTotal(base, tax)
  };
};
