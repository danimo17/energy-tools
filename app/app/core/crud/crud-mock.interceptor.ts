import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Provider } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_LATENCY_MS } from './crud.defaults';
import { Entity, NewEntity } from './types/crud.types';

export class CrudMockInterceptor<T extends Entity> implements HttpInterceptor {
  private items: T[] = [];
  private nextId = 1;

  constructor(private readonly url: string) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url !== this.url && !request.url.startsWith(`${this.url}/`)) {
      return next.handle(request);
    }
    const id = request.url.slice(this.url.length + 1);

    switch (request.method) {
      case 'GET':
        return this.respond(200, [...this.items]);
      case 'POST':
        return this.respond(201, this.add(request.body as NewEntity<T>));
      case 'PUT':
        return this.replace(id, request.body as NewEntity<T>);
      case 'DELETE':
        return this.delete(id);
      default:
        return next.handle(request);
    }
  }

  private add(entity: NewEntity<T>): T {
    const created = { ...entity, id: String(this.nextId++) } as T;
    this.items = [...this.items, created];
    return created;
  }

  private replace(id: string, entity: NewEntity<T>): Observable<HttpEvent<unknown>> {
    if (!this.exists(id)) {
      return this.notFound();
    }
    const updated = { ...entity, id } as T;
    this.items = this.items.map((existing: T): T => (existing.id === id ? updated : existing));
    return this.respond(200, updated);
  }

  private delete(id: string): Observable<HttpEvent<unknown>> {
    if (!this.exists(id)) {
      return this.notFound();
    }
    this.items = this.items.filter((existing: T): boolean => existing.id !== id);
    return this.respond(204, null);
  }

  private exists(id: string): boolean {
    return this.items.some((existing: T): boolean => existing.id === id);
  }

  private notFound(): Observable<HttpEvent<unknown>> {
    return throwError((): HttpErrorResponse => new HttpErrorResponse({ status: 404 })).pipe(delay(MOCK_LATENCY_MS));
  }

  private respond<B>(status: number, body: B): Observable<HttpEvent<B>> {
    return of(new HttpResponse<B>({ status, body })).pipe(delay(MOCK_LATENCY_MS));
  }
}

export const crudMockProvider = (url: string): Provider => ({
  provide: HTTP_INTERCEPTORS,
  useFactory: (): CrudMockInterceptor<Entity> => new CrudMockInterceptor<Entity>(url),
  multi: true
});
