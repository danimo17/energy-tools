import { Pipe, PipeTransform } from '@angular/core';
import { TranslateParams } from '../types/i18n.types';
import { TranslateService } from '../services/translate.service';

@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(key: string, params?: TranslateParams): string {
    return this.translateService.translate(key, params);
  }
}
