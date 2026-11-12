import { JsonRecord, ParsedJson } from './json.types';

export const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const asRecord = (value: unknown): JsonRecord => (isRecord(value) ? value : {});

export const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

export const asNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

export const hasAnyKey = (json: JsonRecord, keys: readonly string[]): boolean =>
  keys.some((key: string): boolean => key in json);

export const parseJson = (text: string): ParsedJson => {
  try {
    return { valid: true, value: JSON.parse(text) as unknown };
  } catch {
    return { valid: false };
  }
};
