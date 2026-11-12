import { MonoTypeOperatorFunction } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DEFAULT_ACTION_TYPE, DEFAULT_ERROR_MESSAGE, DEFAULT_SUCCESS_MESSAGE } from '../button/button.defaults';
import { NotificationService } from './notification.service';
import { ToastOptions } from './toast.types';

export function withToasts<T>(
  notifications: NotificationService,
  options: ToastOptions = {}
): MonoTypeOperatorFunction<T> {
  const type = options.type ?? DEFAULT_ACTION_TYPE;
  const toasts = options.toasts ?? true;
  const successToast = toasts && (options.successToast ?? type === 'write');
  const successMessage = options.successMessage ?? DEFAULT_SUCCESS_MESSAGE;
  const errorMessage = options.errorMessage ?? DEFAULT_ERROR_MESSAGE;

  return tap<T>({
    complete: () => {
      if (successToast) {
        notifications.success(successMessage, options.successParams);
      }
    },
    error: () => {
      if (toasts) {
        notifications.error(errorMessage);
      }
    }
  });
}
