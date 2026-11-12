import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ButtonConfig } from '../button/button.types';
import { CardConfig } from './card.types';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardComponent {
  @Input() title = '';
  @Input() headerButtons: ButtonConfig[] = [];
  @Input() footerButtons: ButtonConfig[] = [];
  @Input() square = false;
  @Input() fullHeight = false;

  @Input() set config(config: CardConfig) {
    Object.assign(this, config);
  }

  @Output() action = new EventEmitter<string>();

  get hasHeader(): boolean {
    return !!this.title || this.headerButtons.length > 0;
  }

  get hasFooter(): boolean {
    return this.footerButtons.length > 0;
  }

  get classes(): string[] {
    return ['card', this.square ? 'card-square' : 'card-rounded', this.fullHeight ? 'card-full-height' : ''];
  }
}
