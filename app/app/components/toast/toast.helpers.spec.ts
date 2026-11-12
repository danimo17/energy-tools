import { of, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { withToasts } from './toast.helpers';

describe('withToasts', () => {
  let notifications: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    notifications = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
  });

  it('shows a success toast by default for write actions', () => {
    of(1)
      .pipe(withToasts(notifications, { type: 'write' }))
      .subscribe();
    expect(notifications.success).toHaveBeenCalledWith('common.success', undefined);
    expect(notifications.error).not.toHaveBeenCalled();
  });

  it('shows no toast at all, not even for errors, when toasts are switched off', () => {
    of(1)
      .pipe(withToasts(notifications, { type: 'write', toasts: false }))
      .subscribe();
    throwError(() => new Error('x'))
      .pipe(withToasts(notifications, { toasts: false }))
      .subscribe({ error: () => undefined });
    expect(notifications.success).not.toHaveBeenCalled();
    expect(notifications.error).not.toHaveBeenCalled();
  });

  it('does not show a success toast for read actions unless requested', () => {
    of(1)
      .pipe(withToasts(notifications, { type: 'read' }))
      .subscribe();
    expect(notifications.success).not.toHaveBeenCalled();

    of(1)
      .pipe(withToasts(notifications, { type: 'read', successToast: true }))
      .subscribe();
    expect(notifications.success).toHaveBeenCalledTimes(1);
  });

  it('can turn the success toast off for write actions and use a custom message', () => {
    of(1)
      .pipe(withToasts(notifications, { type: 'write', successToast: false }))
      .subscribe();
    expect(notifications.success).not.toHaveBeenCalled();

    of(1)
      .pipe(withToasts(notifications, { successMessage: 'custom.key' }))
      .subscribe();
    expect(notifications.success).toHaveBeenCalledWith('custom.key', undefined);
  });

  it('always shows an error toast and rethrows the error', () => {
    let rethrown = false;
    throwError(() => new Error('boom'))
      .pipe(withToasts(notifications, { type: 'read' }))
      .subscribe({ error: (): void => void (rethrown = true) });
    expect(notifications.error).toHaveBeenCalledWith('common.error');
    expect(rethrown).toBeTrue();
  });
});
