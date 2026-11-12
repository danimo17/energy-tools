import { DEFAULT_LANG, LANGUAGES } from './i18n.config';
import { Lang, TranslateParams } from './types/i18n.types';

export const capitalizeIf = (text: string, placeholder: string): string =>
  placeholder.charAt(0) === placeholder.charAt(0).toUpperCase() ? text.charAt(0).toUpperCase() + text.slice(1) : text;

const isLang = (value: string | null | undefined): value is Lang =>
  (LANGUAGES as readonly string[]).includes(value ?? '');

export const detectLanguage = (saved: string | null, browserLanguages: readonly string[]): Lang =>
  [saved, ...browserLanguages.map((language: string): string => language.slice(0, 2).toLowerCase())].find(isLang) ??
  DEFAULT_LANG;

export const entityParams = (entityKey: string): TranslateParams => ({
  entity: { key: `${entityKey}.name` },
  entities: { key: `${entityKey}.plural` },
  gender: { key: `${entityKey}.gender` }
});
