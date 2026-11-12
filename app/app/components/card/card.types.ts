import { ButtonConfig } from '../button/button.types';

export interface CardConfig {
  title?: string;
  headerButtons?: ButtonConfig[];
  footerButtons?: ButtonConfig[];
  square?: boolean;
  fullHeight?: boolean;
}
