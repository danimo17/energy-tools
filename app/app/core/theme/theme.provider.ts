import { APP_INITIALIZER, Provider } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { Theme } from './types/theme.types';

export const THEME_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [ThemeService],
  useFactory: (theme: ThemeService) => (): Theme => theme.theme
};
