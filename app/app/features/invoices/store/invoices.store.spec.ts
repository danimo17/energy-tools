import { HttpClientModule } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MOCK_LATENCY_MS } from '@app/core/crud/crud.defaults';
import { INVOICES_MOCK_PROVIDER } from '../services/invoices.mock';
import { InvoicesService } from '../services/invoices.service';
import { NewInvoice } from '../types/invoices.types';
import { InvoicesStore } from './invoices.store';

const NEW_INVOICE: NewInvoice = {
  format: 'B',
  number: 'INV-1',
  date: '2025-01-01',
  periodFrom: '2025-01-01',
  periodTo: '2025-01-31',
  client: { name: 'ACME', vatNumber: 'B12345678' },
  base: 100,
  tax: 21,
  total: 121
};

describe('InvoicesStore', () => {
  let store: InvoicesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule], providers: [INVOICES_MOCK_PROVIDER] });
    store = TestBed.inject(InvoicesStore);
  });

  it('adds created invoices to the state and exposes their numbers', fakeAsync(() => {
    store.create(NEW_INVOICE).subscribe();
    tick(MOCK_LATENCY_MS);
    expect(store.state.items.length).toBe(1);
  }));

  it('updates an invoice in place', fakeAsync(() => {
    store.create(NEW_INVOICE).subscribe();
    tick(MOCK_LATENCY_MS);
    const id = store.state.items[0].id;
    store.update(id, { ...NEW_INVOICE, base: 500 }).subscribe();
    tick(MOCK_LATENCY_MS);
    expect(store.state.items.length).toBe(1);
    expect(store.state.items[0]).toEqual(jasmine.objectContaining({ id, base: 500 }));
  }));

  it('removes deleted invoices from the state', fakeAsync(() => {
    store.create(NEW_INVOICE).subscribe();
    tick(MOCK_LATENCY_MS);
    store.remove(store.state.items[0].id).subscribe();
    tick(MOCK_LATENCY_MS);
    expect(store.state.items).toEqual([]);
  }));

  it('keeps the state when a delete fails', fakeAsync(() => {
    store.create(NEW_INVOICE).subscribe();
    tick(MOCK_LATENCY_MS);
    store.remove('nope').subscribe({ error: (): void => undefined });
    tick(MOCK_LATENCY_MS);
    expect(store.state.items.length).toBe(1);
  }));

  it('load() fills the items from the backend and toggles loading', fakeAsync(() => {
    TestBed.inject(InvoicesService).create(NEW_INVOICE).subscribe();
    tick(MOCK_LATENCY_MS);
    expect(store.state.items).toEqual([]);
    store.load().subscribe();
    expect(store.state.loading).toBeTrue();
    tick(MOCK_LATENCY_MS);
    expect(store.state.loading).toBeFalse();
    expect(store.state.items.length).toBe(1);
  }));
});
