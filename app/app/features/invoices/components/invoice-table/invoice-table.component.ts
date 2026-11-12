import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableAction, TableColumn, TableRowAction } from '@app/components/table/table.types';
import { valueOrEmpty } from '@app/helpers/format';
import { Observable } from 'rxjs';
import { entityParams } from '@app/core/i18n/i18n.helpers';
import { FormatService } from '../../../../core/i18n/services/format.service';
import { InvoicesStore } from '../../store/invoices.store';
import { Invoice } from '../../types/invoices.types';

const VIEW_ID = 'view';
const INVOICE_ENTITY = entityParams('entity.invoice');

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html'
})
export class InvoiceTableComponent {
  @Input() invoices: Invoice[] = [];
  @Output() view = new EventEmitter<Invoice>();

  readonly columns: TableColumn<Invoice>[] = [
    {
      key: 'number',
      label: 'common.field.number',
      value: (invoice: Invoice): string => valueOrEmpty(invoice.number)
    },
    { key: 'client', label: 'common.field.client', value: (invoice: Invoice): string => invoice.client.name },
    {
      key: 'date',
      label: 'common.field.date',
      value: (invoice: Invoice): string => this.format.date(invoice.date)
    },
    {
      key: 'base',
      label: 'common.field.base',
      value: (invoice: Invoice): string => this.format.currency(invoice.base),
      align: 'end'
    },
    {
      key: 'tax',
      label: 'common.field.tax',
      value: (invoice: Invoice): string => this.format.currency(invoice.tax),
      align: 'end'
    },
    {
      key: 'total',
      label: 'common.field.total',
      value: (invoice: Invoice): string => this.format.currency(invoice.total),
      align: 'end'
    }
  ];

  readonly actions: TableAction<Invoice>[] = [
    {
      id: VIEW_ID,
      label: 'common.action.view',
      labelParams: INVOICE_ENTITY,
      icon: 'eye',
      iconOnly: true,
      variant: 'ghost',
      severity: 'contrast'
    },
    {
      id: 'delete',
      label: 'common.action.delete',
      labelParams: INVOICE_ENTITY,
      icon: 'trash',
      iconOnly: true,
      variant: 'ghost',
      severity: 'error',
      confirm: true,
      confirmMessage: 'common.confirm.delete',
      confirmMessageParams: INVOICE_ENTITY,
      actionType: 'write',
      successMessage: 'common.result.deleted',
      successMessageParams: INVOICE_ENTITY,
      action: (invoice: Invoice): Observable<void> => this.store.remove(invoice.id)
    }
  ];

  constructor(private readonly store: InvoicesStore, private readonly format: FormatService) {}

  onRowAction(event: TableRowAction<Invoice>): void {
    if (event.id === VIEW_ID) {
      this.view.emit(event.row);
    }
  }
}
