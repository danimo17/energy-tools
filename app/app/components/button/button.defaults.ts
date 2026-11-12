import { ButtonActionType, ButtonConfig, ButtonSeverity, ButtonSize, ButtonVariant } from './button.types';

export const DEFAULT_VARIANT: ButtonVariant = 'solid';
export const DEFAULT_SEVERITY: ButtonSeverity = 'primary';
export const DEFAULT_SIZE: ButtonSize = 'md';
export const DEFAULT_ACTION_TYPE: ButtonActionType = 'write';

export const DEFAULT_CONFIRM_MESSAGE = 'common.confirm.message';
export const DEFAULT_SUCCESS_MESSAGE = 'common.success';
export const DEFAULT_ERROR_MESSAGE = 'common.error';

export const HEADER_ICON_BUTTON: Pick<ButtonConfig, 'variant' | 'severity' | 'size' | 'iconOnly'> = {
  variant: 'ghost',
  severity: 'contrast',
  size: 'sm',
  iconOnly: true
};
