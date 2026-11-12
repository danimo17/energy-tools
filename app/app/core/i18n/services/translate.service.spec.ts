import { TestBed } from '@angular/core/testing';
import { entityParams } from '../i18n.helpers';
import { TranslateService } from './translate.service';

describe('TranslateService with entities and gender', () => {
  let service: TranslateService;

  beforeEach(() => {
    service = TestBed.inject(TranslateService);
    service.setLanguage('ca');
  });

  it('uses the feminine variant and capitalizes {Entity}', () => {
    expect(service.translate('common.result.deleted', entityParams('entity.invoice'))).toBe('Factura eliminada');
  });

  it('uses the masculine variant for a masculine entity', () => {
    expect(service.translate('common.result.deleted', entityParams('entity.file'))).toBe('Fitxer eliminat');
  });

  it('keeps {entity} lowercase and follows the language', () => {
    expect(service.translate('common.action.view', entityParams('entity.invoice'))).toBe('Veure factura');
    service.setLanguage('es');
    expect(service.translate('common.action.view', entityParams('entity.file'))).toBe('Ver archivo');
  });

  it('falls back to the plain key and then to the key itself', () => {
    expect(service.translate('common.action.close', entityParams('entity.invoice'))).toBe('Tancar');
    expect(service.translate('missing.key')).toBe('missing.key');
  });
});
