export const trackByKey =
  <K extends string>(key: K) =>
  (_index: number, item: Record<K, string | number>): string | number =>
    item[key];
