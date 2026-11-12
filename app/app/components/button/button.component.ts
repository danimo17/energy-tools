import { Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, finalize } from 'rxjs/operators';
import { TranslateParams } from '../../core/i18n/types/i18n.types';
import { ConfirmService } from '../dialog/confirm.service';
import { IconName } from '../icon/icon.types';
import { NotificationService } from '../toast/notification.service';
import { withToasts } from '../toast/toast.helpers';
import {
  DEFAULT_ACTION_TYPE,
  DEFAULT_CONFIRM_MESSAGE,
  DEFAULT_SEVERITY,
  DEFAULT_SIZE,
  DEFAULT_SUCCESS_MESSAGE,
  DEFAULT_VARIANT
} from './button.defaults';
import { ButtonActionType, ButtonConfig, ButtonSeverity, ButtonSize, ButtonVariant } from './button.types';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {
  @Input() label = '';
  @Input() labelParams?: TranslateParams;
  @Input() variant: ButtonVariant = DEFAULT_VARIANT;
  @Input() severity: ButtonSeverity = DEFAULT_SEVERITY;
  @Input() size: ButtonSize = DEFAULT_SIZE;
  @Input() icon?: IconName;
  @Input() iconOnly = false;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() confirm = false;
  @Input() confirmMessage: string = DEFAULT_CONFIRM_MESSAGE;
  @Input() confirmMessageParams?: TranslateParams;
  @Input() action?: () => Observable<unknown>;
  @Input() actionType: ButtonActionType = DEFAULT_ACTION_TYPE;
  @Input() toasts = true;
  @Input() successToast?: boolean;
  @Input() successMessage: string = DEFAULT_SUCCESS_MESSAGE;
  @Input() successMessageParams?: TranslateParams;

  @Input() set config(config: ButtonConfig) {
    Object.assign(this, config);
  }

  @Output() pressed = new EventEmitter<void>();
  @Output() succeeded = new EventEmitter<void>();

  running = false;

  constructor(private readonly confirmService: ConfirmService, private readonly notifications: NotificationService) {}

  @HostBinding('class.borderless') get borderless(): boolean {
    return this.variant === 'ghost';
  }

  get busy(): boolean {
    return this.loading || this.running;
  }

  get classes(): string[] {
    return [
      'btn',
      `btn-${this.severity}`,
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.iconOnly ? 'btn-icon-only' : ''
    ];
  }

  onClick(): void {
    if (this.disabled || this.busy) {
      return;
    }
    if (this.confirm) {
      this.confirmService
        .confirm({ message: this.confirmMessage, messageParams: this.confirmMessageParams })
        .pipe(filter((accepted: boolean): boolean => accepted))
        .subscribe((): void => this.run());
    } else {
      this.run();
    }
  }

  private run(): void {
    if (!this.action) {
      this.pressed.emit();
      return;
    }
    this.running = true;
    this.action()
      .pipe(
        withToasts(this.notifications, {
          type: this.actionType,
          toasts: this.toasts,
          successToast: this.successToast,
          successMessage: this.successMessage,
          successParams: this.successMessageParams
        }),
        finalize((): void => {
          this.running = false;
        })
      )
      .subscribe({
        complete: (): void => this.succeeded.emit(),
        error: (): void => undefined
      });
  }
}
