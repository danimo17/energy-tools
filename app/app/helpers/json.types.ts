export type JsonRecord = Record<string, unknown>;

export type ParsedJson = { valid: true; value: unknown } | { valid: false };
