import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '../../core/i18n/services/translate.service';
import { UiModule } from '../ui.module';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;

  const button = (): HTMLButtonElement => fixture.nativeElement.querySelector('button');

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [UiModule] });
    TestBed.inject(TranslateService).setLanguage('ca');
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    component.label = 'common.action.accept';
    fixture.detectChanges();
  });

  it('translates the label and applies the default classes', () => {
    expect(button().textContent).toContain('Acceptar');
    expect(button().classList).toContain('btn-primary');
    expect(button().classList).toContain('btn-solid');
    expect(button().classList).toContain('btn-md');
  });

  it('applies severity, variant and size via props or config', () => {
    component.config = { id: 'x', label: 'common.action.cancel', severity: 'error', variant: 'outline', size: 'sm' };
    fixture.detectChanges();
    expect(button().classList).toContain('btn-error');
    expect(button().classList).toContain('btn-outline');
    expect(button().classList).toContain('btn-sm');
    expect(button().textContent).toContain('Cancel·lar');
  });

  it('emits pressed on click', () => {
    let pressed = 0;
    component.pressed.subscribe(() => pressed++);
    button().click();
    expect(pressed).toBe(1);
  });

  it('does not emit when disabled or loading', () => {
    let pressed = 0;
    component.pressed.subscribe(() => pressed++);
    component.disabled = true;
    component.onClick();
    component.disabled = false;
    component.loading = true;
    component.onClick();
    expect(pressed).toBe(0);
  });

  it('in icon-only mode hides the text but keeps the aria-label', () => {
    component.icon = 'eye';
    component.iconOnly = true;
    fixture.detectChanges();
    expect(button().textContent?.trim()).toBe('');
    expect(button().getAttribute('aria-label')).toBe('Acceptar');
  });
});
