import { TranslateParams } from '../../core/i18n/types/i18n.types';

export interface ConfirmOptions {
  message?: string;
  messageParams?: TranslateParams;
  title?: string;
}

export interface ConfirmRequest {
  options: ConfirmOptions;
  resolve: (accepted: boolean) => void;
}

export interface ConfirmState {
  request: ConfirmRequest | null;
}
