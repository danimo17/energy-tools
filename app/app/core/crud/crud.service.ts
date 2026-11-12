import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity, NewEntity } from './types/crud.types';

export abstract class CrudService<T extends Entity> {
  protected constructor(private readonly http: HttpClient, private readonly url: string) {}

  list(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  create(entity: NewEntity<T>): Observable<T> {
    return this.http.post<T>(this.url, entity);
  }

  update(id: string, entity: NewEntity<T>): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, entity);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
