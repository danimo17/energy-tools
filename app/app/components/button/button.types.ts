import { TranslateParams } from '../../core/i18n/types/i18n.types';
import { Observable } from 'rxjs';
import { IconName } from '../icon/icon.types';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSeverity = 'primary' | 'contrast' | 'info' | 'success' | 'warning' | 'error';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonActionType = 'read' | 'write';

export interface ButtonConfig {
  id: string;
  label: string;
  labelParams?: TranslateParams;
  variant?: ButtonVariant;
  severity?: ButtonSeverity;
  size?: ButtonSize;
  icon?: IconName;
  iconOnly?: boolean;
  disabled?: boolean;
  loading?: boolean;
  confirm?: boolean;
  confirmMessage?: string;
  confirmMessageParams?: TranslateParams;
  action?: () => Observable<unknown>;
  actionType?: ButtonActionType;
  toasts?: boolean;
  successToast?: boolean;
  successMessage?: string;
  successMessageParams?: TranslateParams;
}

export type ListOrientation = 'horizontal' | 'vertical';
