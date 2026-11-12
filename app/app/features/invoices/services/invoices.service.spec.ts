import { HttpClientModule } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MOCK_LATENCY_MS } from '@app/core/crud/crud.defaults';
import { Invoice, NewInvoice } from '../types/invoices.types';
import { INVOICES_MOCK_PROVIDER } from './invoices.mock';
import { InvoicesService } from './invoices.service';

const NEW_INVOICE: NewInvoice = {
  format: 'A',
  number: 'F-1',
  date: '2025-01-01',
  periodFrom: '2025-01-01',
  periodTo: '2025-01-31',
  client: { name: 'ACME', vatNumber: 'B12345678' },
  base: 100,
  tax: 21,
  total: 121
};

describe('InvoicesService with the mock backend', () => {
  let service: InvoicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule], providers: [INVOICES_MOCK_PROVIDER] });
    service = TestBed.inject(InvoicesService);
  });

  it('creates, lists and deletes invoices in memory', fakeAsync(() => {
    let created: Invoice | undefined;
    service.create(NEW_INVOICE).subscribe((invoice: Invoice) => (created = invoice));
    tick(MOCK_LATENCY_MS);
    expect(created?.id).toBeTruthy();
    expect(created?.number).toBe('F-1');

    let listed: Invoice[] = [];
    service.list().subscribe((invoices: Invoice[]) => (listed = invoices));
    tick(MOCK_LATENCY_MS);
    expect(listed.length).toBe(1);

    let done = false;
    service.remove(created?.id ?? '').subscribe(() => (done = true));
    tick(MOCK_LATENCY_MS);
    expect(done).toBeTrue();

    service.list().subscribe((invoices: Invoice[]) => (listed = invoices));
    tick(MOCK_LATENCY_MS);
    expect(listed).toEqual([]);
  }));

  it('updates an invoice keeping its id and fails with 404 for an unknown one', fakeAsync(() => {
    let created: Invoice | undefined;
    service.create(NEW_INVOICE).subscribe((invoice: Invoice) => (created = invoice));
    tick(MOCK_LATENCY_MS);

    let updated: Invoice | undefined;
    service
      .update(created?.id ?? '', { ...NEW_INVOICE, base: 999 })
      .subscribe((invoice: Invoice) => (updated = invoice));
    tick(MOCK_LATENCY_MS);
    expect(updated).toEqual(jasmine.objectContaining({ id: created?.id, base: 999 }));

    let status = 0;
    service.update('nope', NEW_INVOICE).subscribe({ error: (error: { status: number }) => (status = error.status) });
    tick(MOCK_LATENCY_MS);
    expect(status).toBe(404);
  }));

  it('assigns different ids and fails with 404 when deleting an unknown invoice', fakeAsync(() => {
    const ids: string[] = [];
    service.create(NEW_INVOICE).subscribe((invoice: Invoice) => ids.push(invoice.id));
    service.create(NEW_INVOICE).subscribe((invoice: Invoice) => ids.push(invoice.id));
    tick(MOCK_LATENCY_MS);
    expect(new Set(ids).size).toBe(2);

    let status = 0;
    service.remove('nope').subscribe({ error: (error: { status: number }) => (status = error.status) });
    tick(MOCK_LATENCY_MS);
    expect(status).toBe(404);
  }));
});
