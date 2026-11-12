import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CardConfig } from '@app/components/card/card.types';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../i18n/services/translate.service';

@Component({
  selector: 'app-settings-drawer',
  templateUrl: './settings-drawer.component.html'
})
export class SettingsDrawerComponent implements OnInit, OnDestroy {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  card: CardConfig = {};

  private readonly subscription = new Subscription();

  constructor(private readonly translate: TranslateService) {}

  ngOnInit(): void {
    this.refreshCard();
    this.subscription.add(this.translate.language$.subscribe((): void => this.refreshCard()));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private refreshCard(): void {
    this.card = { title: this.translate.translate('pages.settings') };
  }
}
