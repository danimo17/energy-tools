import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { readStorage, writeStorage } from '@app/helpers/storage';
import { resolveTheme, THEME_STORAGE_KEY } from '../theme.helpers';
import { Theme } from '../types/theme.types';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly current$ = new BehaviorSubject<Theme>(
    resolveTheme(readStorage(THEME_STORAGE_KEY), window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  readonly theme$ = this.current$.asObservable();

  constructor() {
    this.apply(this.theme);
  }

  get theme(): Theme {
    return this.current$.value;
  }

  toggle(): void {
    this.set(this.theme === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    writeStorage(THEME_STORAGE_KEY, theme);
    this.apply(theme);
    this.current$.next(theme);
  }

  private apply(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
