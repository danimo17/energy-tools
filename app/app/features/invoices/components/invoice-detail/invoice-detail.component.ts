import { Component, Input } from '@angular/core';
import { valueOrEmpty } from '@app/helpers/format';
import { trackByKey } from '@app/helpers/track-by';
import { Lang } from '../../../../core/i18n/types/i18n.types';
import { FormatService } from '../../../../core/i18n/services/format.service';
import { DetailField, Invoice } from '../../types/invoices.types';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent {
  readonly trackByLabel = trackByKey('label');
  @Input() invoice!: Invoice;

  private cache?: { invoice: Invoice; lang: Lang; fields: DetailField[] };

  constructor(private readonly format: FormatService) {}

  get fields(): DetailField[] {
    const { invoice } = this;
    const lang = this.format.language;
    if (this.cache?.invoice !== invoice || this.cache.lang !== lang) {
      this.cache = { invoice, lang, fields: this.buildFields(invoice) };
    }
    return this.cache.fields;
  }

  private buildFields(invoice: Invoice): DetailField[] {
    const fields: DetailField[] = [
      { label: 'common.field.number', value: valueOrEmpty(invoice.number) },
      { label: 'common.field.date', value: this.format.date(invoice.date) },
      {
        label: 'common.field.period',
        value: `${this.format.date(invoice.periodFrom)} – ${this.format.date(invoice.periodTo)}`
      },
      { label: 'common.field.client', value: valueOrEmpty(invoice.client.name) },
      { label: 'common.field.vat', value: valueOrEmpty(invoice.client.vatNumber) }
    ];
    if (invoice.client.address) {
      fields.push({ label: 'common.field.address', value: invoice.client.address });
    }
    fields.push(
      { label: 'common.field.base', value: this.format.currency(invoice.base) },
      { label: 'common.field.tax', value: this.format.currency(invoice.tax) },
      { label: 'common.field.total', value: this.format.currency(invoice.total) }
    );
    return fields;
  }
}
