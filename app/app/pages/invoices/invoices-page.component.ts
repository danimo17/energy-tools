import { Component, OnInit } from '@angular/core';
import { ButtonConfig } from '@app/components/button/button.types';
import { CardConfig } from '@app/components/card/card.types';
import { NotificationService } from '@app/components/toast/notification.service';
import { withToasts } from '@app/components/toast/toast.helpers';
import { Observable } from 'rxjs';
import { TranslateService } from '../../core/i18n/services/translate.service';
import { INVOICES_IMPORT } from '../../features/invoices/invoices.import';
import { InvoicesStore } from '../../features/invoices/store/invoices.store';
import { Invoice } from '../../features/invoices/types/invoices.types';

const IMPORT_ID = 'import';

@Component({
  selector: 'app-invoices-page',
  templateUrl: './invoices-page.component.html'
})
export class InvoicesPageComponent implements OnInit {
  readonly invoices$: Observable<Invoice[]> = this.store.items$;
  readonly loading$: Observable<boolean> = this.store.loading$;

  readonly pageButtons: ButtonConfig[] = [{ id: IMPORT_ID, label: 'common.action.import', icon: 'plus' }];

  readonly importSpec = INVOICES_IMPORT;
  importOpen = false;
  detailOpen = false;
  selected: Invoice | null = null;
  detailCard: CardConfig = {};

  constructor(
    readonly store: InvoicesStore,
    private readonly notifications: NotificationService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.store
      .load()
      .pipe(withToasts(this.notifications, { type: 'read' }))
      .subscribe({ error: (): void => undefined });
  }

  onAction(id: string): void {
    if (id === IMPORT_ID) {
      this.importOpen = true;
    }
  }

  openDetail(invoice: Invoice): void {
    this.selected = invoice;
    this.detailCard = { title: invoice.number || this.translate.translate('common.field.noNumber') };
    this.detailOpen = true;
  }
}
