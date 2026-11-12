import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { OVERLAY_ANIMATION_MS } from '../overlay/overlay.defaults';
import { TranslateService } from '../../core/i18n/services/translate.service';
import { UiModule } from '../ui.module';
import { DrawerComponent } from './drawer.component';

describe('DrawerComponent', () => {
  let fixture: ComponentFixture<DrawerComponent>;
  let drawer: DrawerComponent;

  const el = (selector: string): HTMLElement | null => fixture.nativeElement.querySelector(selector);

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [UiModule] });
    TestBed.inject(TranslateService).setLanguage('ca');
    fixture = TestBed.createComponent(DrawerComponent);
    drawer = fixture.componentInstance;
    drawer.card = { title: 'Title' };
    drawer.open = true;
    fixture.detectChanges();
  });

  it('renders a single square, full-height Card on the right with a close icon', () => {
    expect(fixture.nativeElement.querySelectorAll('.card').length).toBe(1);
    expect(el('.overlay-right')).not.toBeNull();
    expect(el('.card-square')).not.toBeNull();
    expect(el('.card-full-height')).not.toBeNull();
    expect(el('.card-header button')?.getAttribute('aria-label')).toBe('Tancar');
  });

  it('closes on the cross, Esc and outside click, but not when clicking inside the panel', () => {
    let closed = 0;
    drawer.closed.subscribe(() => closed++);
    (el('.overlay-panel') as HTMLElement).click();
    expect(closed).toBe(0);
    (el('.overlay') as HTMLElement).click();
    (el('.card-header button') as HTMLButtonElement).click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(closed).toBe(3);
  });

  it('accepts more header actions, placed before the cross', () => {
    drawer.card = {
      title: 'Title',
      headerButtons: [{ id: 'back', label: 'common.action.back', icon: 'arrow-left', iconOnly: true }]
    };
    drawer.ngOnChanges();
    fixture.detectChanges();
    const labels = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('.card-header button')).map(
      button => button.getAttribute('aria-label')
    );
    expect(labels).toEqual(['Enrere', 'Tancar']);
  });

  it('can open from the left and below an offset', () => {
    drawer.side = 'left';
    drawer.offsetTop = '3.5rem';
    fixture.detectChanges();
    expect(el('.overlay-left')).not.toBeNull();
    expect((el('.overlay') as HTMLElement).style.top).toBe('3.5rem');
  });

  it('plays an out animation and removes itself afterwards', fakeAsync(() => {
    drawer.open = false;
    fixture.detectChanges();
    expect(el('.overlay-closing')).not.toBeNull();
    tick(OVERLAY_ANIMATION_MS);
    fixture.detectChanges();
    expect(el('.overlay')).toBeNull();
  }));

  it('tells when the closing animation is over, not before', fakeAsync(() => {
    let after = 0;
    drawer.afterClosed.subscribe(() => after++);
    drawer.open = false;
    tick(OVERLAY_ANIMATION_MS - 1);
    expect(after).toBe(0);
    tick(1);
    expect(after).toBe(1);
  }));
});
