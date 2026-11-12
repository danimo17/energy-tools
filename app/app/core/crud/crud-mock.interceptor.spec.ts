import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { CrudMockInterceptor } from './crud-mock.interceptor';

describe('CrudMockInterceptor', () => {
  const next = { handle: jasmine.createSpy('handle').and.returnValue(of(new HttpResponse({ status: 200 }))) };
  const interceptor = new CrudMockInterceptor('/api/items');

  beforeEach(() => next.handle.calls.reset());

  it('only answers its own URL, not another URL that starts the same', () => {
    interceptor.intercept(new HttpRequest('GET', '/api/items-archived'), next as unknown as HttpHandler).subscribe();
    expect(next.handle).toHaveBeenCalledTimes(1);
  });

  it('answers its own URL without passing it on', () => {
    interceptor.intercept(new HttpRequest('GET', '/api/items'), next as unknown as HttpHandler).subscribe();
    expect(next.handle).not.toHaveBeenCalled();
  });
});
