import { TranslateParams } from '../../core/i18n/types/i18n.types';
import { ButtonActionType } from '../button/button.types';

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  severity: NotificationSeverity;
  title: string;
  description: string;
}

export interface NotificationsState {
  items: Notification[];
}

export interface ToastOptions {
  type?: ButtonActionType;
  toasts?: boolean;
  successToast?: boolean;
  successMessage?: string;
  successParams?: TranslateParams;
  errorMessage?: string;
}
