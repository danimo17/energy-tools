import { trackByKey } from '@app/helpers/track-by';
import { Component } from '@angular/core';
import { NotificationService } from './notification.service';
import { NotificationsStore } from './notifications.store';

@Component({
  selector: 'app-toast-host',
  templateUrl: './toast-host.component.html',
  styleUrls: ['./toast-host.component.scss']
})
export class ToastHostComponent {
  readonly trackById = trackByKey('id');
  constructor(public store: NotificationsStore, public notifications: NotificationService) {}
}
