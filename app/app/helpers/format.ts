const CURRENCY = 'EUR';
const EMPTY_VALUE = '—';

const memoByLang = <F>(create: (lang: string) => F): ((lang: string) => F) => {
  const cache = new Map<string, F>();
  return (lang: string): F => {
    const cached = cache.get(lang);
    if (cached) {
      return cached;
    }
    const created = create(lang);
    cache.set(lang, created);
    return created;
  };
};

const currencyFormat = memoByLang(
  (lang: string) => new Intl.NumberFormat(lang, { style: 'currency', currency: CURRENCY })
);

const dateFormat = memoByLang((lang: string) => new Intl.DateTimeFormat(lang, { timeZone: 'UTC' }));

export const formatCurrency = (value: number, lang: string): string => currencyFormat(lang).format(value);

export const formatDate = (isoDate: string, lang: string): string => {
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? isoDate : dateFormat(lang).format(date);
};

export const formatDecimal = (value: number, digits = 2): string => value.toFixed(digits);

export const valueOrEmpty = (text: string): string => text || EMPTY_VALUE;
