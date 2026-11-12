import { trackByKey } from '@app/helpers/track-by';
import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ButtonConfig } from '../button/button.types';
import { TableAction, TableColumn, TableRowAction, TableRowView } from './table.types';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent<T> implements OnChanges {
  readonly trackById = trackByKey('id');
  @Input() columns: TableColumn<T>[] = [];
  @Input() rows: T[] = [];
  @Input() actions: TableAction<T>[] = [];

  @Output() rowAction = new EventEmitter<TableRowAction<T>>();

  view: TableRowView<T>[] = [];

  ngOnChanges(): void {
    this.view = this.rows.map(
      (row: T): TableRowView<T> => ({
        row,
        actions: this.actions.map((action: TableAction<T>): ButtonConfig => this.toButtonConfig(action, row))
      })
    );
  }

  private toButtonConfig(tableAction: TableAction<T>, row: T): ButtonConfig {
    const { action, ...config } = tableAction;
    return { ...config, action: action ? (): Observable<unknown> => action(row) : undefined };
  }
}
