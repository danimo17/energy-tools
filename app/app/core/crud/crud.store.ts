import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Store } from '../store/store';
import { CrudService } from './crud.service';
import { CrudState, Entity, NewEntity } from './types/crud.types';

export abstract class CrudStore<T extends Entity> extends Store<CrudState<T>> {
  readonly items$: Observable<T[]> = this.select('items');
  readonly loading$: Observable<boolean> = this.select('loading');

  protected constructor(private readonly service: CrudService<T>) {
    super({ items: [], loading: false });
  }

  load(): Observable<T[]> {
    this.patch({ loading: true });
    return this.service.list().pipe(
      tap((items: T[]): void => this.patch({ items })),
      finalize((): void => this.patch({ loading: false }))
    );
  }

  create(entity: NewEntity<T>): Observable<T> {
    return this.service
      .create(entity)
      .pipe(tap((created: T): void => this.patch({ items: [...this.state.items, created] })));
  }

  update(id: string, entity: NewEntity<T>): Observable<T> {
    return this.service
      .update(id, entity)
      .pipe(
        tap((updated: T): void =>
          this.patch({ items: this.state.items.map((item: T): T => (item.id === id ? updated : item)) })
        )
      );
  }

  remove(id: string): Observable<void> {
    return this.service
      .remove(id)
      .pipe(tap((): void => this.patch({ items: this.state.items.filter((item: T): boolean => item.id !== id) })));
  }
}
