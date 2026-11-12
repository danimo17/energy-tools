import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { HEADER_ICON_BUTTON } from '@app/components/button/button.defaults';
import { ButtonConfig } from '@app/components/button/button.types';
import { CardConfig } from '@app/components/card/card.types';
import { MOBILE_QUERY } from '../../menu.defaults';
import { observeMediaQuery } from '../../menu.helpers';
import { Observable, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { TranslateService } from '../../../i18n/services/translate.service';

const BACK_ID = 'back';

const BACK_BUTTON: ButtonConfig = {
  id: BACK_ID,
  label: 'common.action.back',
  icon: 'arrow-left',
  ...HEADER_ICON_BUTTON
};

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {
  @Input() settingsPanel?: TemplateRef<unknown>;
  @Output() settings = new EventEmitter<void>();

  readonly mobile$: Observable<boolean> = observeMediaQuery(MOBILE_QUERY).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  drawerOpen = false;
  view: 'menu' | 'settings' = 'menu';
  drawerCard: CardConfig = {};

  private readonly subscription = new Subscription();

  constructor(private readonly translate: TranslateService) {}

  ngOnInit(): void {
    this.refreshCard();
    this.subscription.add(this.translate.language$.subscribe((): void => this.refreshCard()));
    this.subscription.add(
      this.mobile$.subscribe((mobile: boolean): void => {
        if (!mobile) {
          this.drawerOpen = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
    if (this.drawerOpen) {
      this.showView('menu');
    }
  }

  openSettings(): void {
    this.showView('settings');
  }

  showView(view: 'menu' | 'settings'): void {
    this.view = view;
    this.refreshCard();
  }

  onDrawerAction(id: string): void {
    if (id === BACK_ID) {
      this.showView('menu');
    }
  }

  private refreshCard(): void {
    const settings = this.view === 'settings';
    this.drawerCard = {
      title: this.translate.translate(settings ? 'pages.settings' : 'app.name'),
      headerButtons: settings ? [BACK_BUTTON] : []
    };
  }
}
