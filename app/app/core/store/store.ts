import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export abstract class Store<S> {
  private readonly subject: BehaviorSubject<S>;
  readonly state$: Observable<S>;

  protected constructor(initial: S) {
    this.subject = new BehaviorSubject<S>(initial);
    this.state$ = this.subject.asObservable();
  }

  get state(): S {
    return this.subject.value;
  }

  select<K extends keyof S>(key: K): Observable<S[K]> {
    return this.state$.pipe(
      map(state => state[key]),
      distinctUntilChanged()
    );
  }

  protected patch(partial: Partial<S>): void {
    this.subject.next({ ...this.state, ...partial });
  }
}
