import { asNumber, asString, hasAnyKey } from '@app/helpers/json';
import { InvoiceFormat } from '../../types/invoices.types';

export const formatB: InvoiceFormat = {
  id: 'B',

  detect: json => hasAnyKey(json, ['bill_number', 'bill_date', 'from_date', 'to_date']),

  toDraft: json => ({
    format: 'B',
    number: asString(json['bill_number']),
    date: asString(json['bill_date']),
    periodFrom: asString(json['from_date']),
    periodTo: asString(json['to_date']),
    client: {
      name: asString(json['client']),
      vatNumber: asString(json['vat_number'])
    },
    base: asNumber(json['base']),
    tax: asNumber(json['tax']),
    total: asNumber(json['total'])
  })
};
