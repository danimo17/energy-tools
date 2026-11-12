import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ButtonConfig } from '../button/button.types';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() buttons: ButtonConfig[] = [];

  @Output() action = new EventEmitter<string>();
}
