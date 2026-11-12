import { Directive, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { OVERLAY_ANIMATION_MS } from './overlay.defaults';
import { HEADER_ICON_BUTTON } from '../button/button.defaults';
import { ButtonConfig } from '../button/button.types';
import { CardConfig } from '../card/card.types';
import { OverlayState, OverlayPosition } from './overlay.types';

const CLOSE_ACTION_ID = 'close';

const CLOSE_BUTTON: ButtonConfig = {
  id: CLOSE_ACTION_ID,
  label: 'common.action.close',
  icon: 'close',
  ...HEADER_ICON_BUTTON
};

@Directive()
export abstract class OverlayBase implements OnInit, OnChanges, OnDestroy {
  @Input() card: CardConfig = {};
  @Input() offsetTop = '0';

  @Input() set open(value: boolean) {
    if (value === this.isOpen) {
      return;
    }
    this.isOpen = value;
    clearTimeout(this.timer);
    if (value) {
      this.state = 'open';
    } else if (this.state !== 'closed') {
      this.state = 'closing';
      this.timer = setTimeout((): void => {
        this.state = 'closed';
        this.afterClosed.emit();
      }, OVERLAY_ANIMATION_MS);
    }
  }

  @Output() closed = new EventEmitter<void>();
  @Output() afterClosed = new EventEmitter<void>();
  @Output() action = new EventEmitter<string>();

  state: OverlayState = 'closed';
  cardConfig: CardConfig = {};

  abstract get position(): OverlayPosition;
  protected abstract readonly closeOnBackdrop: boolean;
  protected abstract readonly cardStyle: CardConfig;

  private isOpen = false;
  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.buildCardConfig();
  }

  ngOnChanges(): void {
    this.buildCardConfig();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.state === 'open') {
      this.closed.emit();
    }
  }

  onBackdrop(): void {
    if (this.closeOnBackdrop) {
      this.closed.emit();
    }
  }

  onAction(id: string): void {
    if (id === CLOSE_ACTION_ID) {
      this.closed.emit();
    } else {
      this.action.emit(id);
    }
  }

  private buildCardConfig(): void {
    this.cardConfig = {
      ...this.card,
      ...this.cardStyle,
      headerButtons: [...(this.card.headerButtons ?? []), CLOSE_BUTTON]
    };
  }
}
