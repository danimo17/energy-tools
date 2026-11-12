import { Injectable } from '@angular/core';
import { Store } from '@app/core/store/store';
import { Observable } from 'rxjs';
import { DEFAULT_CONFIRM_MESSAGE } from '../button/button.defaults';
import { ConfirmOptions, ConfirmState } from './dialog.types';

export const DEFAULT_CONFIRM_TITLE = 'common.confirm.title';

@Injectable({ providedIn: 'root' })
export class ConfirmService extends Store<ConfirmState> {
  constructor() {
    super({ request: null });
  }

  confirm(options: ConfirmOptions = {}): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      const resolve = (accepted: boolean): void => {
        this.patch({ request: null });
        subscriber.next(accepted);
        subscriber.complete();
      };
      this.state.request?.resolve(false);
      this.patch({ request: { options: { message: DEFAULT_CONFIRM_MESSAGE, ...options }, resolve } });
    });
  }
}
