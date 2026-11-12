import { Injectable } from '@angular/core';
import { formatCurrency, formatDate } from '@app/helpers/format';
import { Lang } from '../types/i18n.types';
import { TranslateService } from './translate.service';

@Injectable({ providedIn: 'root' })
export class FormatService {
  constructor(private readonly translate: TranslateService) {}

  get language(): Lang {
    return this.translate.language;
  }

  currency(value: number): string {
    return formatCurrency(value, this.translate.language);
  }

  date(isoDate: string): string {
    return formatDate(isoDate, this.translate.language);
  }
}
