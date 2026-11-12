import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ButtonConfig } from '@app/components/button/button.types';
import { CardConfig } from '@app/components/card/card.types';
import { TableColumn } from '@app/components/table/table.types';
import { CrudStore } from '@app/core/crud/crud.store';
import { Entity, NewEntity } from '@app/core/crud/types/crud.types';
import { entityParams } from '@app/core/i18n/i18n.helpers';
import { TranslateService } from '@app/core/i18n/services/translate.service';
import { TranslateParams } from '@app/core/i18n/types/i18n.types';
import { trackByKey } from '@app/helpers/track-by';
import { from, Observable, of, Subscription } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap, toArray } from 'rxjs/operators';
import { CLOSE_ID, STATUS_VIEW } from '../../import.defaults';
import { statusOf, toImportResult } from '../../import.helpers';
import { ImportResult, ImportSpec, PendingFile, PendingStatus } from '../../types/import.types';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent<T extends Entity> implements OnInit, OnDestroy {
  @Input() open = false;
  @Input() store!: CrudStore<T>;
  @Input() spec!: ImportSpec<T>;
  @Output() closed = new EventEmitter<void>();

  readonly fileEntity = entityParams('entity.file');
  readonly trackById = trackByKey('id');

  entity: TranslateParams = {};
  pending: PendingFile[] = [];
  results: ImportResult<NewEntity<T>>[] = [];
  running = false;
  card: CardConfig = {};

  readonly resultColumns: TableColumn<ImportResult<NewEntity<T>>>[] = [
    { key: 'file', label: 'common.field.file', value: (result: ImportResult<NewEntity<T>>): string => result.fileName },
    {
      key: 'status',
      label: 'common.field.status',
      value: (result: ImportResult<NewEntity<T>>): string =>
        this.translate.translate(STATUS_VIEW[statusOf(result)].label, this.entity),
      className: (result: ImportResult<NewEntity<T>>): string => STATUS_VIEW[statusOf(result)].className
    },
    {
      key: 'comments',
      label: 'common.field.comments',
      value: (result: ImportResult<NewEntity<T>>): string => this.commentsOf(result),
      wrap: true
    }
  ];

  private nextId = 1;
  private readonly subscription = new Subscription();

  constructor(private readonly translate: TranslateService) {}

  ngOnInit(): void {
    this.entity = entityParams(this.spec.entityKey);
    this.refreshCard();
    this.subscription.add(this.translate.language$.subscribe((): void => this.refreshCard()));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  statusLabel(status: PendingStatus): string {
    return STATUS_VIEW[status].label;
  }

  statusClass(status: PendingStatus): string {
    return STATUS_VIEW[status].className;
  }

  addFiles(files: File[]): void {
    this.results = [];
    this.pending = [
      ...this.pending,
      ...files.map((file: File): PendingFile => ({ id: this.nextId++, file, status: 'pending' }))
    ];
    this.refreshCard();
  }

  removeFile(id: number): void {
    this.pending = this.pending.filter((item: PendingFile): boolean => item.id !== id);
    this.refreshCard();
  }

  onAction(id: string): void {
    if (id === CLOSE_ID) {
      this.close();
    }
  }

  close(): void {
    if (this.running) {
      return;
    }
    this.closed.emit();
  }

  reset(): void {
    this.pending = [];
    this.results = [];
    this.refreshCard();
  }

  uploadAll(): Observable<ImportResult<NewEntity<T>>[]> {
    const items = this.pending.filter((item: PendingFile): boolean => item.status === 'pending');
    this.results = [];
    this.running = true;
    this.refreshCard();
    return from(items).pipe(
      concatMap((item: PendingFile): Observable<ImportResult<NewEntity<T>>> => this.processFile(item)),
      toArray(),
      tap((results: ImportResult<NewEntity<T>>[]): void => {
        this.running = false;
        this.results = results;
        this.pending = this.pending.filter((item: PendingFile): boolean => item.status === 'blocked');
        this.refreshCard();
      })
    );
  }

  private processFile(item: PendingFile): Observable<ImportResult<NewEntity<T>>> {
    this.setStatus(item, 'uploading');
    return from(item.file.text()).pipe(
      switchMap((text: string): Observable<ImportResult<NewEntity<T>>> => this.importText(item.file.name, text)),
      catchError(
        (): Observable<ImportResult<NewEntity<T>>> => of(this.failure(item.file.name, 'import.issue.malformedJson'))
      ),
      tap((result: ImportResult<NewEntity<T>>): void => {
        this.setStatus(item, statusOf(result));
      })
    );
  }

  private importText(fileName: string, text: string): Observable<ImportResult<NewEntity<T>>> {
    const outcome = this.spec.parse(text);
    const result = toImportResult(fileName, outcome);
    const entity = outcome.entity;
    if (!entity) {
      return of(result);
    }
    const identifier = this.spec.identifierOf(entity);
    const existing = this.store.state.items.find((item: T): boolean => this.spec.identifierOf(item) === identifier);
    const save$: Observable<unknown> = existing ? this.store.update(existing.id, entity) : this.store.create(entity);
    return save$.pipe(
      map((): ImportResult<NewEntity<T>> => ({ ...result, operation: existing ? 'update' : 'create' })),
      catchError((): Observable<ImportResult<NewEntity<T>>> => of(this.failure(fileName, 'import.serverError')))
    );
  }

  private failure(fileName: string, message: string): ImportResult<NewEntity<T>> {
    return { fileName, status: 'blocked', issues: [{ severity: 'blocking', message }], operation: null, entity: null };
  }

  private commentsOf(result: ImportResult<NewEntity<T>>): string {
    const note =
      result.operation === 'update' && result.entity
        ? [
            this.translate.translate('import.updatedNote', {
              ...this.entity,
              identifier: this.spec.identifierOf(result.entity)
            })
          ]
        : [];
    const issues = result.issues.map(issue => this.translate.translate(issue.message, issue.params));
    return [...note, ...issues].map((comment: string): string => `· ${comment}`).join('\n');
  }

  private setStatus(item: PendingFile, status: PendingStatus): void {
    item.status = status;
    this.refreshCard();
  }

  private refreshCard(): void {
    const close: ButtonConfig = {
      id: CLOSE_ID,
      label: 'common.action.close',
      variant: 'outline',
      severity: 'contrast',
      disabled: this.running
    };
    const upload: ButtonConfig = {
      id: 'upload',
      label: 'common.action.upload',
      icon: 'upload',
      disabled: !this.pending.some((item: PendingFile): boolean => item.status === 'pending') || this.running,
      action: (): Observable<ImportResult<NewEntity<T>>[]> => this.uploadAll(),
      actionType: 'write',
      toasts: false
    };
    this.card = {
      title: this.translate.translate('import.title', this.entity),
      footerButtons: [close, upload]
    };
  }
}
