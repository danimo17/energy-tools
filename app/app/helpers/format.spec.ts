import { formatCurrency, formatDate } from './format';

describe('format', () => {
  it('formats euro amounts according to the language', () => {
    expect(formatCurrency(12345.6, 'ca')).toContain('12.345,60');
    expect(formatCurrency(12345.6, 'es')).toContain('12.345,60');
    expect(formatCurrency(12345.6, 'ca')).toContain('€');
  });

  it('formats ISO dates without shifting the day', () => {
    expect(formatDate('2025-02-05', 'ca')).toMatch(/5\/2\/2025/);
    expect(formatDate('2025-02-05', 'es')).toMatch(/5\/2\/2025/);
  });

  it('returns the original text when the date is invalid', () => {
    expect(formatDate('no-es-data', 'ca')).toBe('no-es-data');
  });
});
