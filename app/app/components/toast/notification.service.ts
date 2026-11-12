import { Injectable } from '@angular/core';
import { TOAST_DURATION_MS } from './toast.defaults';
import { TranslateParams } from '../../core/i18n/types/i18n.types';
import { TranslateService } from '../../core/i18n/services/translate.service';
import { NotificationSeverity } from './toast.types';
import { NotificationsStore } from './notifications.store';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;

  constructor(private store: NotificationsStore, private translate: TranslateService) {}

  show(severity: NotificationSeverity, descriptionKey: string, params?: TranslateParams, titleKey?: string): void {
    const id = this.nextId++;
    this.store.add({
      id,
      severity,
      title: this.translate.translate(titleKey ?? `toast.title.${severity}`, params),
      description: this.translate.translate(descriptionKey, params)
    });
    setTimeout(() => this.dismiss(id), TOAST_DURATION_MS);
  }

  info(descriptionKey: string, params?: TranslateParams, titleKey?: string): void {
    this.show('info', descriptionKey, params, titleKey);
  }

  success(descriptionKey: string, params?: TranslateParams, titleKey?: string): void {
    this.show('success', descriptionKey, params, titleKey);
  }

  warning(descriptionKey: string, params?: TranslateParams, titleKey?: string): void {
    this.show('warning', descriptionKey, params, titleKey);
  }

  error(descriptionKey: string, params?: TranslateParams, titleKey?: string): void {
    this.show('error', descriptionKey, params, titleKey);
  }

  dismiss(id: number): void {
    this.store.remove(id);
  }
}
