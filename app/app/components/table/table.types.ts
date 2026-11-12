import { Observable } from 'rxjs';
import { ButtonConfig } from '../button/button.types';

export interface TableColumn<T> {
  key: string;
  label: string;
  value: (row: T) => string;
  className?: (row: T) => string;
  align?: 'start' | 'end';
  wrap?: boolean;
}

export interface TableAction<T> extends Omit<ButtonConfig, 'action'> {
  action?: (row: T) => Observable<unknown>;
}

export interface TableRowAction<T> {
  id: string;
  row: T;
}

export interface TableRowView<T> {
  row: T;
  actions: ButtonConfig[];
}
