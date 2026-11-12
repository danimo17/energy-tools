import { asNumber, asRecord, asString, hasAnyKey } from '@app/helpers/json';
import { InvoiceFormat } from '../../types/invoices.types';

export const formatA: InvoiceFormat = {
  id: 'A',

  detect: json => hasAnyKey(json, ['range', 'number']),

  toDraft: json => {
    const range = asRecord(json['range']);
    const client = asRecord(json['client']);
    return {
      format: 'A',
      number: asString(json['number']),
      date: asString(json['date']),
      periodFrom: asString(range['from']),
      periodTo: asString(range['to']),
      client: {
        name: asString(client['name']),
        vatNumber: asString(client['vat_number']),
        address: asString(client['address'])
      },
      base: asNumber(json['base']),
      tax: asNumber(json['tax']),
      total: asNumber(json['total'])
    };
  }
};
