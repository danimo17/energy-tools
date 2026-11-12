import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { readStorage, writeStorage } from '@app/helpers/storage';
import { capitalizeIf, detectLanguage } from '../i18n.helpers';
import { LANG_STORAGE_KEY } from '../i18n.config';
import { Lang, TranslateParams, TranslateRef } from '../types/i18n.types';
import { TRANSLATIONS } from '../translations';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly current$ = new BehaviorSubject<Lang>(
    detectLanguage(readStorage(LANG_STORAGE_KEY), navigator.languages ?? [navigator.language])
  );
  readonly language$ = this.current$.asObservable();

  constructor() {
    this.syncDocument();
  }

  get language(): Lang {
    return this.current$.value;
  }

  setLanguage(lang: Lang): void {
    writeStorage(LANG_STORAGE_KEY, lang);
    this.current$.next(lang);
    this.syncDocument();
  }

  translate(key: string, params: TranslateParams = {}): string {
    const gender = 'gender' in params ? this.resolve(params['gender']) : '';
    const text = TRANSLATIONS[this.language][`${key}.${gender}`] ?? TRANSLATIONS[this.language][key] ?? key;
    return text.replace(/\{(\w+)\}/g, (match, name: string) => {
      const value = params[name] ?? params[name.charAt(0).toLowerCase() + name.slice(1)];
      return value === undefined ? match : capitalizeIf(this.resolve(value), name);
    });
  }

  private resolve(value: string | number | TranslateRef): string {
    return typeof value === 'object' ? this.translate(value.key) : String(value);
  }

  private syncDocument(): void {
    document.documentElement.lang = this.language;
    document.title = this.translate('app.name');
  }
}
