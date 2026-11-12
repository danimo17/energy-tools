import { Lang } from './types/i18n.types';
export const LANGUAGES = ['ca', 'es'] as const;

export const DEFAULT_LANG: Lang = 'ca';
export const LANG_STORAGE_KEY = 'lang';
