import { Dictionary, TranslationTree } from '../types/i18n.types';

export const flatten = (tree: TranslationTree, prefix = ''): Dictionary =>
  Object.fromEntries(
    Object.entries(tree).flatMap(([key, value]): [string, string][] => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof value === 'string' ? [[path, value]] : Object.entries(flatten(value, path));
    })
  );
