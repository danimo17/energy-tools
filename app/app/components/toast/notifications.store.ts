import { Injectable } from '@angular/core';
import { Store } from '@app/core/store/store';
import { Notification, NotificationsState } from './toast.types';

@Injectable({ providedIn: 'root' })
export class NotificationsStore extends Store<NotificationsState> {
  constructor() {
    super({ items: [] });
  }

  add(notification: Notification): void {
    this.patch({ items: [...this.state.items, notification] });
  }

  remove(id: number): void {
    this.patch({ items: this.state.items.filter(item => item.id !== id) });
  }
}
