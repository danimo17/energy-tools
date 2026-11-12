import { Dictionary, Lang } from '../types/i18n.types';
import { flatten } from './flatten';
import ca from './ca.json';
import es from './es.json';

export const TRANSLATIONS: Record<Lang, Dictionary> = { ca: flatten(ca), es: flatten(es) };
