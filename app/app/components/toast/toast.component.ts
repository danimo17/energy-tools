import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { NotificationSeverity } from './toast.types';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToastComponent {
  @Input() severity: NotificationSeverity = 'info';
  @Input() title = '';
  @Input() description = '';
  @Output() closed = new EventEmitter<void>();
}
