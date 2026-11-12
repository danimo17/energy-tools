import { Theme } from './types/theme.types';

export const THEME_STORAGE_KEY = 'theme';

const isTheme = (value: string | null): value is Theme => value === 'light' || value === 'dark';

export const resolveTheme = (saved: string | null, prefersDark: boolean): Theme =>
  [saved, prefersDark ? 'dark' : 'light'].find(isTheme) ?? 'light';
