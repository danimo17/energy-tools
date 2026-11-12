import { LANGUAGES } from '../i18n.config';

export type Lang = (typeof LANGUAGES)[number];

export interface TranslateRef {
  key: string;
}

export type TranslateParams = Record<string, string | number | TranslateRef>;

export type Dictionary = Record<string, string>;

export interface TranslationTree {
  [key: string]: string | TranslationTree;
}
