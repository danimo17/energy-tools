import { Observable } from 'rxjs';

export const observeMediaQuery = (query: string): Observable<boolean> => {
  return new Observable<boolean>(subscriber => {
    const list = window.matchMedia(query);
    subscriber.next(list.matches);
    const listener = (event: MediaQueryListEvent): void => subscriber.next(event.matches);
    list.addEventListener('change', listener);
    return (): void => list.removeEventListener('change', listener);
  });
};
