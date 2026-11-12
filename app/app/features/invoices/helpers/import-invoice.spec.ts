import factura_A1 from '@samples/factura_A1.json';
import factura_A2 from '@samples/factura_A2.json';
import factura_A3 from '@samples/factura_A3.json';
import factura_B1 from '@samples/factura_B1.json';
import factura_B2 from '@samples/factura_B2.json';
import factura_B3 from '@samples/factura_B3.json';
import { InvoiceFormat, InvoiceFormatId, NewInvoice } from '../types/invoices.types';
import { ImportResult } from '@app/core/import/types/import.types';
import { JsonRecord } from '@app/helpers/json.types';
import { INVOICE_FORMATS } from './formats';
import { toImportResult } from '@app/core/import/import.helpers';
import { importInvoice } from './import-invoice';

function run(sample: unknown): ImportResult<NewInvoice> {
  return toImportResult('file.json', importInvoice(JSON.stringify(sample)));
}

const messages = (result: ImportResult<NewInvoice>): string[] => result.issues.map(issue => issue.message);

describe('importInvoice with the sample invoices', () => {
  it('imports A1, A3, B1 and B2 without warnings', () => {
    for (const sample of [factura_A1, factura_A3, factura_B1, factura_B2]) {
      const result = run(sample);
      expect(result.status).toBe('ok');
      expect(result.issues).toEqual([]);
      expect(result.entity).not.toBeNull();
    }
  });

  it('A2: created with warnings for the inverted range and the invalid VAT', () => {
    const result = run(factura_A2);
    expect(result.status).toBe('ok-warnings');
    expect(messages(result)).toEqual(['invoices.issue.invertedRange', 'invoices.issue.invalidVat']);
    expect(result.entity?.number).toBe('F2025-0048');
  });

  it('B3: NOT created (empty number is blocking on purpose, D47) and reports the total mismatch too', () => {
    const result = run(factura_B3);
    expect(result.status).toBe('blocked');
    expect(result.entity).toBeNull();
    expect(messages(result)).toEqual(['invoices.issue.emptyNumber', 'invoices.issue.totalMismatch']);
    expect(result.issues[1].params).toEqual({ total: '1600.00', expected: '1512.50' });
  });

  it('converts both formats to the same Invoice shape', () => {
    const a = run(factura_A1).entity;
    const b = run(factura_B1).entity;
    expect(a).toEqual({
      format: 'A',
      number: 'F2025-0001',
      date: '2025-02-05',
      periodFrom: '2025-01-01',
      periodTo: '2025-01-31',
      client: {
        name: 'Industrial Ferrer S.L.',
        vatNumber: 'B67234591',
        address: 'Carrer de la Indústria 24, 08025 Barcelona'
      },
      base: 1250,
      tax: 262.5,
      total: 1512.5
    });
    expect(b?.format).toBe('B');
    expect(b?.client.address).toBeUndefined();
    expect(Object.keys(b ?? {}).sort()).toEqual(Object.keys(a ?? {}).sort());
  });
});

describe('importInvoice blocking cases', () => {
  const blockedWith = (result: ImportResult<NewInvoice>, message: string): void => {
    expect(result.status).toBe('blocked');
    expect(result.entity).toBeNull();
    expect(messages(result)).toContain(message);
  };

  it('blocks malformed JSON', () => {
    blockedWith(toImportResult('x.json', importInvoice('{ not json')), 'import.issue.malformedJson');
  });

  it('blocks JSON that no format recognizes (also arrays and primitives)', () => {
    blockedWith(run({ hello: 'world' }), 'import.issue.unknownFormat');
    blockedWith(run([1, 2]), 'import.issue.unknownFormat');
    blockedWith(run(42), 'import.issue.unknownFormat');
  });

  it('blocks a missing or non-numeric base, in both formats', () => {
    blockedWith(run({ ...factura_A1, base: undefined }), 'invoices.issue.baseRequired');
    blockedWith(run({ ...factura_B1, base: '980.40' }), 'invoices.issue.baseRequired');
  });
});

describe('importInvoice informative cases', () => {
  it('computes a missing tax (21 %) and a missing total (base + tax)', () => {
    const result = run({ ...factura_A1, tax: undefined, total: undefined });
    expect(result.entity?.tax).toBe(262.5);
    expect(result.entity?.total).toBe(1512.5);
    expect(messages(result)).toEqual(['invoices.issue.taxComputed', 'invoices.issue.totalComputed']);
  });

  it('reports a missing VAT number as missing, not as invalid', () => {
    const withoutVat = { ...factura_A1, client: { ...factura_A1.client, vat_number: '' } };
    expect(messages(run(withoutVat))).toEqual(['invoices.issue.missingVat']);
  });

  it('warns about a missing address only in the format that has one (A, not B)', () => {
    const withoutAddress = { ...factura_A1, client: { ...factura_A1.client, address: '' } };
    expect(messages(run(withoutAddress))).toEqual(['invoices.issue.missingAddress']);
    expect(messages(run(factura_B1))).toEqual([]);
  });
});

describe('importInvoice: the 21 % rule also applies to format B', () => {
  it('computes the missing tax (21 % of the base) and total', () => {
    const result = run({ ...factura_B1, tax: undefined, total: undefined });
    expect(result.entity?.tax).toBe(205.88);
    expect(result.entity?.total).toBe(1186.28);
    expect(result.issues.map(issue => issue.message)).toEqual([
      'invoices.issue.taxComputed',
      'invoices.issue.totalComputed'
    ]);
  });
});

describe('a future invoice format (D10)', () => {
  const formatC: InvoiceFormat = {
    id: 'C' as unknown as InvoiceFormatId,
    detect: (json: JsonRecord): boolean => 'factura_c' in json,
    toDraft: (json: JsonRecord) => ({
      format: 'C' as unknown as InvoiceFormatId,
      number: String(json['numero']),
      date: '2025-01-01',
      periodFrom: '2025-01-01',
      periodTo: '2025-01-31',
      client: { name: 'Futur S.L.', vatNumber: 'B12345678', address: 'Somewhere' },
      base: Number(json['importe']),
      tax: 21,
      total: 121
    })
  };

  afterEach(() => {
    const registry = INVOICE_FORMATS as InvoiceFormat[];
    const index = registry.indexOf(formatC);
    if (index >= 0) {
      registry.splice(index, 1);
    }
  });

  it('is imported by the same pipeline once it is added to the registry', () => {
    const sample = { factura_c: true, numero: 'C-1', importe: 100 };
    expect(run(sample).status).toBe('blocked');

    (INVOICE_FORMATS as InvoiceFormat[]).push(formatC);
    const result = run(sample);
    expect(result.status).toBe('ok');
    expect(result.entity?.number).toBe('C-1');
  });
});
