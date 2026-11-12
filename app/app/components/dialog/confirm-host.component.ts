import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateParams } from '../../core/i18n/types/i18n.types';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../core/i18n/services/translate.service';
import { ButtonConfig } from '../button/button.types';
import { CardConfig } from '../card/card.types';
import { ConfirmService, DEFAULT_CONFIRM_TITLE } from './confirm.service';
import { ConfirmRequest } from './dialog.types';

const CANCEL_ID = 'cancel';
const ACCEPT_ID = 'accept';

const FOOTER_BUTTONS: ButtonConfig[] = [
  { id: CANCEL_ID, label: 'common.action.cancel', variant: 'outline', severity: 'contrast' },
  { id: ACCEPT_ID, label: 'common.action.accept' }
];

@Component({
  selector: 'app-confirm-host',
  templateUrl: './confirm-host.component.html'
})
export class ConfirmHostComponent implements OnInit, OnDestroy {
  open = false;
  card: CardConfig = {};
  message = '';
  messageParams?: TranslateParams;

  private request: ConfirmRequest | null = null;
  private subscription?: Subscription;

  constructor(private readonly confirmService: ConfirmService, private readonly translate: TranslateService) {}

  ngOnInit(): void {
    this.subscription = this.confirmService.select('request').subscribe((request: ConfirmRequest | null): void => {
      this.request = request;
      if (request) {
        this.message = request.options.message ?? '';
        this.messageParams = request.options.messageParams;
        this.card = {
          title: this.translate.translate(request.options.title ?? DEFAULT_CONFIRM_TITLE),
          footerButtons: FOOTER_BUTTONS
        };
      }
      this.open = request !== null;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onAction(id: string): void {
    this.resolve(id === ACCEPT_ID);
  }

  resolve(accepted: boolean): void {
    this.request?.resolve(accepted);
  }
}
