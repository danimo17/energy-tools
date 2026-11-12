import { trackByKey } from '@app/helpers/track-by';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ButtonConfig, ListOrientation } from '../button/button.types';

@Component({
  selector: 'app-button-list',
  templateUrl: './button-list.component.html',
  styleUrls: ['./button-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonListComponent {
  readonly trackById = trackByKey('id');
  @Input() buttons: ButtonConfig[] = [];
  @Input() orientation: ListOrientation = 'horizontal';
  @Input() wrap = false;

  @Output() action = new EventEmitter<string>();
}
