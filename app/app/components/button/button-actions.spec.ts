import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, Subject, throwError } from 'rxjs';
import { TranslateService } from '../../core/i18n/services/translate.service';
import { ConfirmService } from '../dialog/confirm.service';
import { ConfirmRequest } from '../dialog/dialog.types';
import { NotificationsStore } from '../toast/notifications.store';
import { UiModule } from '../ui.module';
import { ButtonComponent } from './button.component';

describe('ButtonComponent with action', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;
  let notifications: NotificationsStore;
  let confirmService: ConfirmService;

  const click = (): void => (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
  const severities = (): string[] => notifications.state.items.map(item => item.severity);

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [UiModule] });
    TestBed.inject(TranslateService).setLanguage('ca');
    notifications = TestBed.inject(NotificationsStore);
    confirmService = TestBed.inject(ConfirmService);
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    component.label = 'common.action.accept';
    fixture.detectChanges();
  });

  it('shows loading while the action runs and a success toast for write actions', () => {
    const work = new Subject<void>();
    component.action = (): Observable<unknown> => work;
    click();
    fixture.detectChanges();
    expect(component.busy).toBeTrue();
    expect(fixture.nativeElement.querySelector('.btn-spinner')).not.toBeNull();

    let succeeded = 0;
    component.succeeded.subscribe(() => succeeded++);
    work.complete();
    fixture.detectChanges();
    expect(component.busy).toBeFalse();
    expect(severities()).toEqual(['success']);
    expect(succeeded).toBe(1);
  });

  it('shows only an error toast when the action fails, even for read actions', () => {
    component.actionType = 'read';
    component.action = (): Observable<unknown> => throwError(() => new Error('boom'));
    click();
    expect(severities()).toEqual(['error']);
    expect(component.busy).toBeFalse();
  });

  it('read actions only toast success when requested', () => {
    component.actionType = 'read';
    component.action = (): Observable<unknown> => of(1);
    click();
    expect(severities()).toEqual([]);

    component.successToast = true;
    click();
    expect(severities()).toEqual(['success']);
  });

  it('asks for confirmation first and runs only if accepted', () => {
    let runs = 0;
    component.confirm = true;
    component.action = (): Observable<unknown> => {
      runs++;
      return of(1);
    };

    click();
    const request = confirmService.state.request as ConfirmRequest;
    expect(runs).toBe(0);
    request.resolve(false);
    expect(runs).toBe(0);

    click();
    (confirmService.state.request as ConfirmRequest).resolve(true);
    expect(runs).toBe(1);
  });

  it('without action it emits pressed after the confirmation', () => {
    let pressed = 0;
    component.pressed.subscribe(() => pressed++);
    component.confirm = true;
    click();
    expect(pressed).toBe(0);
    (confirmService.state.request as ConfirmRequest).resolve(true);
    expect(pressed).toBe(1);
  });
});
